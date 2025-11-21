import type React from "react";
import { AppSidebar } from "~/components/ui/appsidebar";
import MainHeader from "~/components/ui/mainheader";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { NavigationProvider } from "~/contexts/navigation-context";
import { auth } from "~/server/auth";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return (
        <NavigationProvider>
            <SidebarProvider>
                <AppSidebar
                    user={session?.user ? {
                        name: session.user.name ?? null,
                        email: session.user.email ?? null,
                        image: session.user.image ?? null,
                    } : undefined}
                />

                <SidebarInset>
                    <MainHeader />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </NavigationProvider>
    )
};

export default HomeLayout;