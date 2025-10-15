import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserType } from "@/@types/user.types";
import { reqImpl } from "@/api/main";

type UseUserType = {
  isLoading: boolean;
  user: UserType | null;
  token: string | null;
  refreshToken: string | null;
};

const useUser = create(
  persist<UseUserType>(
    () => ({
      user: null,
      isLoading: false,
      token: null,
      refreshToken: null,
    }),
    {
      name: "auth",
      partialize: ({ refreshToken, user }) =>
        ({ refreshToken, user } as UseUserType),
    }
  )
);

const { setState: set } = useUser;

const setLoading = (isLoading: UseUserType["isLoading"]) =>
  set({
    isLoading,
  });

const setUser = (user: UserType) =>
  set({
    user,
  });

const setToken = (token: UseUserType["token"]) =>
  set({
    token,
  });

const setRefreshToken = (refreshToken: UseUserType["refreshToken"]) =>
  set({
    refreshToken,
  });

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  setLoading(true);

  try {
    const data = await reqImpl<{
      user: UserType;
      token: {
        access: string;
        refresh: string;
      };
    }>("auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!data.success) {
      throw data.error;
    }

    const {
      token: { access, refresh },
      user,
    } = data.data;

    set({
      refreshToken: refresh,
      token: access,
      user,
    });
  } catch (e) {
    console.error("ERROR login:", e);
  } finally {
    setLoading(false);
  }
};

export { setUser, setToken, setRefreshToken, setLoading, login };

export default useUser;
