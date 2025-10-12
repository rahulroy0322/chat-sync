import useSocket, { connectIO } from "@/store/io.store";
import { useEffect, type FC } from "react";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGU5ZjA2ZjZhZDY2ZmI5OWFkNDljZDMiLCJhdmF0YXJVcmwiOiIvcHJvZmlsZS5naWYiLCJlbWFpbCI6InJhYXRAZXhhbXBsZS5jb20iLCJ1bmFtZSI6IlJhYXQiLCJpYXQiOjE3NjAyNjIzMTgsImV4cCI6MTc2MDI2MjYxOH0.-T81HgbELXemL9TOqPMNpmAUzbKS38cLlhamwo4Z_N0";

const handleError = (e: unknown) => {
  console.error(e);
};

const handleConnected = () => {
  console.log("connection successful");
};

const Socket: FC = () => {
  const io = useSocket((state) => state.io);

  useEffect(() => {
    const socket = connectIO(token);

    return () => {
      socket();
    };
  }, []);

  useEffect(() => {
    io?.on("connect", handleConnected);
    io?.on("connect_error", handleError);

    return () => {
      io?.off("connect");
      io?.off("connect_error");
    };
  }, [io]);
  return null;
};

export default Socket;
