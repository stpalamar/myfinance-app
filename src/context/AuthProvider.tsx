import { createContext, useState, useContext } from 'react';

export type Auth = {
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

interface AuthContext {
  auth: Auth | null;
  setAuth: (auth: Auth | any) => void;
  persist: boolean;
  setPersist: (persist: boolean | any) => void;
}

export const AuthContext = createContext<AuthContext>({
  auth: null,
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState();
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist') || 'false')
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
