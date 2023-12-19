import { createContext, useState, FC, ReactNode, useEffect } from "react";

type AuthContextData = {
  auth: {
    email: string;
  };
  setAuth?: (data: { email: string }) => void;
};

const AuthContext = createContext<AuthContextData>({
  auth: { email: "" },
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState({ email: "" });
  const contextData: AuthContextData = {
    auth,
    setAuth: (data) => setAuth(data),
  };
  useEffect(() => console.log("autoryzacja w kontekscie", auth), [auth]);
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
