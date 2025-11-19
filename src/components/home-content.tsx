"use client"

import { useNavigation } from "~/contexts/navigation-context"
import { Button } from "~/components/ui/button"
import { CirclePlus, FileBraces } from "lucide-react"

type HomeContentProps = {
    userName?: string | null
}

export function HomeContent({ userName }: HomeContentProps) {
    const { activeNavItem } = useNavigation()

    // Render component based on active nav item
    switch (activeNavItem?.url) {
        case "home":
            return (
                <div className="flex flex-col justify-center items-center gap-48 p-4 m-4 pt-0">
                    <span className="font-bold text-4xl">
                        Welcome {userName?.split(" ")[0]}! 👋
                    </span>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                        <Button className="border-2 flex-col font-semibold cursor-pointer border-black border-dotted rounded-lg flex items-center justify-center shadow-lg min-w-[180px] min-h-[120px] sm:min-w-48 sm:min-h-48 w-full max-w-xs sm:w-auto text-center">
                            <CirclePlus />
                            <span className="mt-2">Create a new workflow</span>
                        </Button>
                        <Button className="border-2 flex-col font-semibold cursor-pointer border-black border-dotted rounded-lg flex items-center justify-center shadow-lg min-w-[180px] min-h-[120px] sm:min-w-48 sm:min-h-48 w-full max-w-xs sm:w-auto text-center">
                            <FileBraces />
                            <span className="mt-2">Your workflows</span>
                        </Button>
                    </div>
                </div>
            )
        case "workflow":
            return (
                <div className="flex flex-col justify-center items-center gap-48 p-4 m-4 pt-0">
                    <span className="font-bold text-4xl">Workflows</span>
                    <p>Workflow content goes here</p>
                </div>
            )
        case "execution":
            return (
                <div className="flex flex-col justify-center items-center gap-48 p-4 m-4 pt-0">
                    <span className="font-bold text-4xl">Executions</span>
                    <p>Execution content goes here</p>
                </div>
            )
        case "credentials":
            return (
                <div className="flex flex-col justify-center items-center gap-48 p-4 m-4 pt-0">
                    <span className="font-bold text-4xl">Credentials</span>
                    <p>Credentials content goes here</p>
                </div>
            )
    }
}

