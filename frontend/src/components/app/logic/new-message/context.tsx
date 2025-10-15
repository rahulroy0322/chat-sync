import { createContext, type FC, type ReactNode, use, useState } from 'react';

type AddUserContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const AddUserContext = createContext<AddUserContextType | null>(null);

const useAddUserContext = () => {
  const context = use(AddUserContext);
  if (!context) {
    throw new Error(
      '"useAddUserContext" should only be used inside "AddUserContextProvider"'
    );
  }
  return context;
};

type AddUserContextProviderPropsType = {
  children: ReactNode;
};

const AddUserContextProvider: FC<AddUserContextProviderPropsType> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <AddUserContext
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </AddUserContext>
  );
};

export { AddUserContextProvider };

export default useAddUserContext;
