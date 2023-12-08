import { createContext, useState, FC, ReactNode } from "react";

type AuthContextData = {
    auth: {
        email: string;
        token: string;
    }
    setAuth?: (data: { email: string; token: string }) => void;
}

const AuthContext = createContext<AuthContextData>({ auth: { email: '', token: '' } });

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState({ email: '', token: '' });
    const contextData: AuthContextData = {
        auth,
        setAuth: (data) => setAuth(data),
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
