"use client"

import { CheckIcon, ChevronsUpDown } from "lucide-react"
import Link from "next/link"

import * as React from "react"

import { Button } from "~/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { cn } from "~/lib/utils"

const createOptions = [
  {
    value: "create-workflow",
    label: "Create workflow",
    href: "/workflows/new",
  },
  {
    value: "create-credential",
    label: "Create credential",
    href: "/credentials/new",
  },
  {
    value: "create-variable",
    label: "Create variable",
    href: "/variables/new",
  },
]

export default function CreateActionCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(createOptions[0]?.value ?? "")

  const selectedOption =
    createOptions.find((option) => option.value === value) ?? createOptions[0]

  return (
    <div className="inline-flex w-full max-w-[240px] items-stretch overflow-hidden border shadow-sm">
      <Button
        asChild
        variant="noShadow"
        className="flex-1 rounded-none bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition"
      >
        <Link href={selectedOption?.href ?? "#"}>{selectedOption?.label}</Link>
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="noShadow"
            role="combobox"
            aria-expanded={open}
            className="rounded-none bg-blue-600 px-2 text-white transition cursor-pointer"
          >
            <ChevronsUpDown className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] border border-black bg-white p-1 text-black shadow-lg">
          <Command>
            <CommandList className="space-y-1">
              <CommandGroup>
                {createOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm  hover:bg-blue-600 hover:text-white"
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
