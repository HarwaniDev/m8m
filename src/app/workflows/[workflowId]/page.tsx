"use client"
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "~/components/ui/custom/appsidebar";
import EditorComponent from "~/components/ui/custom/editor";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import WorkflowHeader from "~/components/ui/custom/workflowheader";
import { NavigationProvider } from "~/contexts/navigation-context";
import { EditorContextProvider } from "~/contexts/editor-context";

const WorkflowComponent = () => {
    const pathName = usePathname();
    const workflowId = pathName.split("/workflows/")[1];
    const session = useSession();
    return (
        <NavigationProvider>
            <EditorContextProvider>
                <SidebarProvider>
                    <AppSidebar
                        user={session?.data?.user.name ? {
                            name: session.data.user.name,
                            email: session.data.user.email,
                            image: session.data.user.image,
                        } : undefined}
                    />
                    <SidebarInset>
                        <WorkflowHeader workflowId={workflowId!} />
                        <EditorComponent workflowId={workflowId!} />
                    </SidebarInset>
                </SidebarProvider>
            </EditorContextProvider>
        </NavigationProvider>
    )
}

export default WorkflowComponent;