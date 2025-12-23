import { Plus } from "lucide-react"
import { Button } from "../button"

interface HeaderProps {
    title: string;
    description: string;
    buttonTitle: string;
    disabled: boolean
    onNew: () => void
}
export const EntityHeader = ({title, description, buttonTitle, disabled, onNew}: HeaderProps) => {
    return (
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-2xl font-bold text-foreground">{title}</p>
                <p className="text-base font-medium text-muted-foreground">{description}</p>
            </div>
            <Button variant="default" className="flex w-full items-center justify-center gap-2 rounded-lg border cursor-pointer border-black bg-blue-600 font-semibold text-white shadow-lg hover:bg-blue-500 sm:w-auto"
            onClick={onNew} disabled={disabled}>
                <Plus /> {buttonTitle}
            </Button>
        </div>
    )
}