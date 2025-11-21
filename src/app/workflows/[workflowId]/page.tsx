"use client"
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation"
import { AppSidebar } from "~/components/ui/appsidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import WorkflowHeader from "~/components/ui/workflowheader";
import { NavigationProvider } from "~/contexts/navigation-context";

const WorkflowComponent = () => {
    const pathName = usePathname();
    const workflowId = pathName.split("/workflows/")[1];
    const session = useSession();
    return (
        <NavigationProvider>
            <SidebarProvider>
                <AppSidebar
                    user={session?.data?.user ? {
                        name: session.data.user.name ?? null,
                        email: session.data.user.email ?? null,
                        image: session.data.user.image ?? null,
                    } : undefined}
                />
                <SidebarInset>
                    <WorkflowHeader workflowId={workflowId!} />
                </SidebarInset>
            </SidebarProvider>
        </NavigationProvider>
    )
}

export default WorkflowComponent;