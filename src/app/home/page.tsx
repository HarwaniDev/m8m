import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import SignInComponent from "~/components/ui/signInButton"
import { AppSidebar } from "~/components/ui/appsidebar"
import { auth } from "~/server/auth"
import { NavigationProvider } from "~/contexts/navigation-context"
import { HomeContent } from "~/components/home-content"

export default async function Page() {    
  const session = await auth();

  return (
    <NavigationProvider>
      <SidebarProvider className="bg-white text-black">
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
          <HomeContent userName={session?.user.name ?? null} />
        </SidebarInset>
      </SidebarProvider>
    </NavigationProvider>
  )
}
