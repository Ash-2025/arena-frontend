import { useAuth } from "@/hooks/UseAuth"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const {user, loading} = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return user===undefined ? <Navigate to="/auth" replace={true} /> : children ;
}

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return !user ? children : <Navigate to="/" replace={true} />;
}