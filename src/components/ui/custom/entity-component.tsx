import { Menu, Trash, type LucideProps } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import Image from "next/image";
const EntityComponent = ({
    name,
    createdAt,
    updatedAt,
    Icon,
    onDelete,
}: {
    name: string;
    createdAt: string;
    updatedAt: string;
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> | string;
    onDelete: () => void;
}) => {
    return (
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border/60 bg-card/30 p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer">
            <div className="flex w-full flex-1 items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60 sm:h-14 sm:w-14">
                    {typeof Icon === "string" ? <Image src={Icon} alt={Icon} height={16} width={16}/> : <Icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" />}
                </span>
                <div className="flex min-w-0 flex-col">
                    <p className="truncate text-base font-semibold text-foreground md:text-lg">{name}</p>
                    <p className="text-sm text-muted-foreground">Created {createdAt} ago • Updated {updatedAt} ago</p>
                </div>
            </div>
            <div className="flex w-full items-center justify-end sm:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Menu className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-blue-600 text-white border-black rounded-lg">
                        <DropdownMenuGroup >
                            <DropdownMenuItem className="font-semibold" onClick={onDelete}>
                                <Trash />
                                <span >Remove</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default EntityComponent;