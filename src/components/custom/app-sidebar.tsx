import { Gamepad, Ghost, Home, LayoutDashboard } from "lucide-react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import * as React from "react";
import Profile from "@/components/custom/Profile.tsx";
import { Link } from "react-router-dom";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "games",
        url: "games",
        icon: Gamepad,
    },
    {
        title: "profile",
        url: "/profile",
        icon: Ghost,
    }
    
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible={"offcanvas"} {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Profile />
            </SidebarFooter>
        </Sidebar>
    )
}