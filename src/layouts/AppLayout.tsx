import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/custom/app-sidebar.tsx";
import { ThemeProvider } from "@/components/custom/theme-provider.tsx";
import { ModeToggle } from "@/components/custom/mode-toggle.tsx";
import { Outlet } from "react-router-dom";
export const AppLayout = () => {
    return (
        <ThemeProvider defaultTheme="dark">
            <main className="h-screen w-full">
                <SidebarProvider>
                    <AppSidebar variant={"inset"} />
                    <main className="w-full h-screen rounded-md shadow-lg relative">
                        <div className="flex flex-col gap-2 w-full h-full p-2">
                            <div className='flex flex-row justify-between items-center p-2 border-1 rounded-md h-12'>
                                <SidebarTrigger />
                                <ModeToggle />
                            </div>
                            <div className="w-full h-full p-4 border-1 rounded-md overflow-y-scroll">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </SidebarProvider>
            </main>
        </ThemeProvider>
    )
}