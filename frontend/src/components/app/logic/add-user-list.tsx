import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  createContext,
  type FC,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { MessageType } from "@/@types/message.types";
import type { UserType } from "@/@types/user.types";
import { req } from "@/api/main";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addMessage, setMsgId } from "@/store/messages.store";
import { setContactOpen } from "@/store/settings.store";

type ContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const Context = createContext<ContextType | null>(null);

const useContext = () => {
  const context = use(Context);
  if (!context) {
    throw new Error('invalid call for "useContext"');
  }
  return context;
};

type ContextPrioviderPropsType = {
  children: ReactNode;
};

const ContextPriovider: FC<ContextPrioviderPropsType> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Context
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </Context>
  );
};

type UserLinkPropsType = {
  id: string;
  children: ReactNode;
};

const UserLink: FC<UserLinkPropsType> = ({ id, children }) => {
  const { loading, setLoading } = useContext();

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const { message } = await req<{
        message: MessageType;
      }>("/msg", {
        method: "POST",
        body: {
          uid: id,
        },
      });

      addMessage(message);
      setContactOpen(false);
      setMsgId(message._id);
    } catch (e) {
      console.error("ERROR:", e);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading]);

  return (
    <Button
      className={cn("hover:no-underline cursor-pointer")}
      disabled={loading}
      onClick={handleClick}
      variant="link"
    >
      {children}
    </Button>
  );
};

type UserItemPropsType = UserType;

const UserItem: FC<UserItemPropsType> = ({ _id, avatarUrl, uname }) => (
  <li className="flex gap-2 items-center p-1 w-full">
    <UserLink id={_id}>
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{uname.at(0)}</AvatarFallback>
      </Avatar>
      <div
        className="grow pointer-events-none cursor-pointer"
        role="presentation"
      >
        <h2 className="text-base font-semibold w-fit">{uname}</h2>
      </div>
    </UserLink>
  </li>
);

const AddUsersList: FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cont = new AbortController();

    const getUsers = async () => {
      setIsLoading(true);
      try {
        const { users } = await req<{ users: UserType[] }>(
          "user",
          undefined,
          cont.signal
        );

        setUsers(users);
      } catch (e) {
        console.error("ERROR:", e);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();

    return () => {
      cont.abort();
    };
  }, []);

  if (isLoading) {
    return "fetching";
  }

  return (
    <ContextPriovider>
      <ul>
        {users.map((user) => (
          <UserItem {...user} key={user._id} />
        ))}
      </ul>
    </ContextPriovider>
  );
};

export default AddUsersList;
