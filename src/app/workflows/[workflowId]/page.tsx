import { AppSidebar } from "~/components/ui/appsidebar";
import EditorComponent from "~/components/ui/editor";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import WorkflowHeader from "~/components/ui/workflowheader";
import { NavigationProvider } from "~/contexts/navigation-context";
import { auth } from "~/server/auth";

const WorkflowComponent = async () => {
    // const pathName = usePathname();
    // const workflowId = pathName.split("/workflows/")[1];
    const session = await auth();
    return (
        <NavigationProvider>
            <SidebarProvider>
                <AppSidebar
                    user={session?.user.name ? {
                        name: session.user.name,
                        email: session.user.email,
                        image: session.user.image,
                    } : undefined}
                />
                <SidebarInset>
                    <WorkflowHeader />
                    <EditorComponent />
                </SidebarInset>
            </SidebarProvider>
        </NavigationProvider>
    )
}

export default WorkflowComponent;