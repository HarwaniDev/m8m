import { SidebarTrigger } from "~/components/ui/sidebar"
import SignInComponent from "~/components/ui/custom/signInButton"

const MainHeader = () => {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-blue-100 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-black border border-black hover:bg-blue-50 rounded-md" />
            </div>
            <div className="flex justify-center items-center">
                <SignInComponent />
            </div>
        </header>
    )
}

export default MainHeader;