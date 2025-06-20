// import { Card, CardContent } from "../ui/card";
import {Avatar,AvatarImage,AvatarFallback} from '../ui/avatar'
import {LogOut} from 'lucide-react'
import { SidebarMenuButton } from "../ui/sidebar";
import {Button} from "@/components/ui/button.tsx";
import { useAuth } from '@/hooks/UseAuth';
import { authClient } from '@/lib/auth-client';
import { useNavigate } from 'react-router-dom';

// import { SidebarMenuButton } from "../ui/sidebar";

export default function Profile(){
    const {user, setUser} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async() => {
        // Implement logout functionality here
        await authClient.signOut();
        setUser(undefined);
        navigate('/auth', {replace: true});
    }
    return (
        <>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2 dark:border-muted-foreground py-6 px-2"
            >
                
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.image ?? undefined} alt={"Img"} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user ? user.name : ""}</span>
                    <span className="truncate text-xs">{user ? user.email : ""}</span>
                </div>
                <Button className='hover:bg-destructive bg-background' onClick={handleLogout}>
                    <LogOut className="ml-auto size-4 stroke-primary" />
                </Button>
            </SidebarMenuButton>
        </>
    )
}