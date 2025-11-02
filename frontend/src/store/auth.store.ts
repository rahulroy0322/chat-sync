import { create } from 'zustand';

type UseAuthType = {
  state: 'login' | 'register' | 'forget' | 'none';
};

const useAuth = create<UseAuthType>(() => ({
  state: 'none',
}));

const { setState: set } = useAuth;

const setAuthScreen = (state: UseAuthType['state']) =>
  set({
    state,
  });

export { setAuthScreen };

export default useAuth;
