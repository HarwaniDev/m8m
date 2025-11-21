"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

type NavItem = {
    title: string
    url: string
    icon?: React.ComponentType
    isActive: boolean
}

type NavigationContextType = {
    navMain: NavItem[]
    setNavMain: React.Dispatch<React.SetStateAction<NavItem[]>>
    activeNavItem: NavItem | null
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [navMain, setNavMain] = React.useState<NavItem[]>([])
    const pathname = usePathname();
    const route = pathname.split("/")[1];
    const activeNavItem = React.useMemo(() => {
        if (!route) {
            return null
        }
        return navMain.find((item) => item.url === route) || null
    }, [navMain, route])

    return (
        <NavigationContext.Provider value={{ navMain, setNavMain, activeNavItem }}>
            {children}
        </NavigationContext.Provider>
    )
}

export function useNavigation() {
    const context = React.useContext(NavigationContext)
    if (context === undefined) {
        throw new Error("useNavigation must be used within a NavigationProvider")
    }
    return context
}

