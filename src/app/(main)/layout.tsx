import type React from "react";
import { AppSidebar } from "~/components/appsidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { NavigationProvider } from "~/contexts/navigation-context";
import { auth } from "~/server/auth";
import SignInComponent from "~/components/ui/signInButton"
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
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-blue-100 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="-ml-1 text-black border border-black hover:bg-blue-50 rounded-md" />
                        </div>
                        <div className="flex justify-center items-center">
                            <SignInComponent />
                        </div>
                    </header>
                    
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </NavigationProvider>
    )
};

export default HomeLayout;