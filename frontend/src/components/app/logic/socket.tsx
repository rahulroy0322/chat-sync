import { type FC, useEffect, useMemo } from "react";
import useSocket, {
  addOnlineUser,
  connectIO,
  removeOnlineUser,
} from "@/store/io.store";
import useUser from "@/store/user.store";
import type { UserType } from "@/@types/user.types";
import useMessages from "@/store/messages.store";
import type { ChatType } from "@/@types/chat.types";
import { addChat } from "@/store/chat.store";

const handleError = (e: unknown) => {
  console.error("Socket connection error:", e);
};

const Socket: FC = () => {
  const io = useSocket((state) => state.io);

  const token = useUser((state) => state.token);
  const user = useUser((state) => state.user);

  const messages = useMessages((state) => state.messages);
  const selectedMsg = useMessages((state) => state.selectedMsg);

  const contacts = useMemo(() => {
    if (!messages?.length || !user?._id) {
      return [];
    }

    return messages.map(
      ({ users }) => users.find((u) => u._id !== user._id)?._id
    );
  }, [messages, user?._id]);

  useEffect(() => {
    const ret = () => {
      io?.close();
    };
    if (!token) return ret;
    if (io) {
      return;
    }
    connectIO(token);

    return ret;
  }, [token, io]);

  useEffect(() => {
    io?.on("connect_error", handleError);

    return () => {
      io?.off("connect_error", handleError);
    };
  }, [io]);

  useEffect(() => {
    io?.emit("contacts", contacts);
  }, [io, contacts]);

  useEffect(() => {
    const onChat = (chat: ChatType) => {
      if (chat.msgId === selectedMsg) {
        addChat(chat);
      }
    };

    io?.on("chat", onChat);

    return () => {
      io?.off("chat", onChat);
    };
  }, [io, selectedMsg]);

  useEffect(() => {
    const handleOnlineUser = ({ userId }: { userId: UserType["_id"] }) => {
      addOnlineUser(userId);
    };
    const handleOfflineUser = ({ userId }: { userId: UserType["_id"] }) => {
      removeOnlineUser(userId);
    };

    io?.on("online", handleOnlineUser);
    io?.on("offline", handleOfflineUser);

    return () => {
      io?.off("online", handleOnlineUser);
      io?.off("offline", handleOfflineUser);
    };
  }, [io]);

  return null;
};

export default Socket;
