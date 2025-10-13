import { Search, UserRoundPlus } from "lucide-react";
import { type FC, type PropsWithChildren, useCallback, useEffect } from "react";
import type {
  MessageType,
  MessageTypeandTextType,
} from "@/@types/message.types";
import type { UserType } from "@/@types/user.types";
import { req } from "@/api/main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useMessages, {
  setFetching,
  setMessages,
  setMsgId,
} from "@/store/messages.store";
import useSettings, { setContactOpen } from "@/store/settings.store";
import AddUsersList from "../logic/add-user-list";
import HeaderUI from "../ui/header";
import StatusIcon from "../ui/status-icon";
import MessagesLayoutLogic from "./message-logic.layout";

type LayoutLinkPropsType = PropsWithChildren & {
  id: string;
};

const LayoutLink: FC<LayoutLinkPropsType> = ({ id, children }) => {
  const handleClick = useCallback(() => {
    setMsgId(id);
  }, [id]);

  return (
    // biome-ignore lint/a11y/useButtonType: is not ay ready button
    <button
      className="flex gap-2 items-center p-1 cursor-pointer w-full"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

type MassageItemPropsType = {
  avatarUrl: string;
  uname: string;
  uid: UserType["_id"];
} & MessageTypeandTextType &
  Pick<MessageType, "sender" | "text" | "status">;

const MassageItem: FC<MassageItemPropsType> = ({
  avatarUrl,
  uname,
  status,
  uid,
  // type,
  sender: { _id: sid } = {
    _id: uid,
  },
  text,
}) => (
  <li>
    <LayoutLink id={uid}>
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{uname}</AvatarFallback>
      </Avatar>
      <div className="grow" role="presentation">
        <h2 className="text-base font-semibold w-fit">{uname}</h2>
        <div className="flex gap-1 items-center" role="presentation">
          <h3 className="line-clamp-1 text-start text-sm grow">{text}</h3>
          {uid === sid ? null : (
            <StatusIcon
              className={cn("size-5 p-0.5 shrink-0", {
                "text-cyan-500": status === "read",
              })}
              status={status}
            />
          )}
        </div>
      </div>
    </LayoutLink>
  </li>
);

const user = {
  _id: "u-1",
  avatarUrl: "/profile.gif",
  uname: "username",
} satisfies UserType;

const MessagesList: FC = () => {
  const messages = useMessages((state) => state.messages);

  const isFetching = useMessages((state) => state.isFetching);

  useEffect(() => {
    const cont = new AbortController();

    const getMessages = async () => {
      try {
        setFetching(true);
        const { messages } = await req<{ messages: MessageType[] }>(
          "msg",
          undefined,
          cont.signal
        );

        setMessages(messages);
      } catch (e) {
        console.error("ERROR:", e);
      } finally {
        setFetching(false);
      }
    };

    getMessages();

    return () => {
      cont.abort();
    };
  }, []);

  if (isFetching) {
    // TODO!
    return "fetching";
  }

  if (!messages) {
    // TODO!
    return null;
  }

  return (
    <>
      <ul>
        {messages.map(({ _id, ...props }) => (
          <MassageItem
            avatarUrl={user.avatarUrl}
            key={_id}
            uid={user._id}
            uname={user.uname}
            {...props}
          />
        ))}
      </ul>
      <Button
        className="rounded-full cursor-pointer absolute right-5 bottom-5"
        onClick={() => {
          setContactOpen(true);
        }}
        size="icon-lg"
        variant="outline"
      >
        <UserRoundPlus />
      </Button>
    </>
  );
};

const MessagesORUserList: FC = () => {
  const isContactOpen = useSettings((state) => state.isContactOpen);
  if (isContactOpen) {
    return <AddUsersList />;
  }
  return <MessagesList />;
};

type MessagesLayoutPropsType = PropsWithChildren;

const MessagesLayout: FC<MessagesLayoutPropsType> = ({ children }) => {
  const selected = useMessages((state) => state.selectedMsg);

  return (
    <MessagesLayoutLogic
      selected={selected}
      side={
        <div
          className="w-full h-full md:basis-80 flex flex-col border-r"
          role="presentation"
        >
          <HeaderUI>
            <div
              className="w-2/3 text-ring placeholder:text-muted-foreground rounded-md focus-within:border-ring flex gap-2 px-3 py-1 border-2 border-input"
              role="presentation"
            >
              <Search />
              <input
                className="outline-none w-full"
                placeholder="Search Chat..."
              />
            </div>
          </HeaderUI>
          <div className="grow overflow-auto px-2 relative" role="presentation">
            <MessagesORUserList />
          </div>
        </div>
      }
    >
      <main className="grow h-full overflow-hidden">{children}</main>
    </MessagesLayoutLogic>
  );
};

export default MessagesLayout;
