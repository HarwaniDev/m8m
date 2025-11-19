"use client"

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

    const activeNavItem = React.useMemo(() => {
        return navMain.find(item => item.isActive) || null
    }, [navMain])

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

