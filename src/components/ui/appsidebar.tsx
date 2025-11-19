"use client"

import {
    BookOpen,
    FileBraces,
    House,
    LogOut,
    MonitorCog,
    SquareTerminal,
    Workflow
} from "lucide-react"
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "~/components/ui/sidebar"
import { useNavigation } from "~/contexts/navigation-context"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Home",
            url: "home",
            icon: House,
            isActive: true,
        },
        {
            title: "Workflows",
            url: "workflow",
            icon: FileBraces,
            isActive: false,
        },
        {
            title: "Executions",
            url: "execution",
            icon: MonitorCog,
            isActive: false
        },
        {
            title: "Credentials",
            url: "credentials",
            icon: BookOpen,
            isActive: false
        },
    ],
}

export function AppSidebar({
    user,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}) {
    const { isMobile, state } = useSidebar();
    const { navMain, setNavMain } = useNavigation();

    React.useEffect(() => {
        setNavMain(data.navMain);
    }, []);

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-5">
                            <Workflow />
                            {state === "expanded" && (
                                <span className="font-bold text-center text-black">m8m - Workflow Automation</span>
                            )}
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {navMain.map((item, key) => (
                            <SidebarMenuItem key={key}>
                                <SidebarMenuButton
                                    className={item.isActive
                                        ? "bg-blue-600 text-white border-2 border-black rounded-lg"
                                        : ""}
                                    tooltip={item.title}
                                    onClick={() => {
                                        setNavMain(prev =>
                                            prev.map((nav, idx) => ({
                                                ...nav,
                                                isActive: idx === key
                                            }))
                                        );
                                    }}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {(user?.email && user?.name && user?.image) ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        className="group-data-[state=collapsed]:hover:outline-0 group-data-[state=collapsed]:hover:bg-transparent overflow-visible"
                                        size="lg"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user.image || "https://github.com/shadcn.png?size=40"}
                                                alt={user.name || "User"}
                                            />
                                            <AvatarFallback>
                                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-heading">
                                                {user.name || "User"}
                                            </span>
                                            <span className="truncate text-xs">{user.email || ""}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 bg-blue-600 text-white border-black rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-base">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user.image || "https://github.com/shadcn.png?size=40"}
                                                    alt={user.name || "User"}
                                                />
                                                <AvatarFallback className="text-white">
                                                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-heading">
                                                    {user.name || "User"}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {user.email || ""}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <LogOut />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="w-full flex justify-center p-2">
                                {/* <SignInComponent /> */}
                            </div>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
