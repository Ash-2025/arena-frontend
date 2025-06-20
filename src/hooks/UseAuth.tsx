import { authClient } from "@/lib/auth-client";
import { createContext, useContext, useEffect, useState } from "react"

type user = {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined;
}
type AuthContextType = {
    user: user | undefined;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<user | undefined>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<user | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data } = await authClient.getSession();
            if (data?.user) {
                setUser(data.user)
            }
            setLoading(false);
        }
        init();
    }, [])

    return <AuthContext.Provider value={{ user, loading, setUser }}>
        {children}
    </AuthContext.Provider>
};

export const useAuth = () =>{
    const userContext = useContext(AuthContext);
    if (!userContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return userContext;
}