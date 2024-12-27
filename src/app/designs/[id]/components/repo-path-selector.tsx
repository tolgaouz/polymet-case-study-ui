"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";

const paths = [
  { value: "/components/ui/button", label: "/components/ui/button" },
  { value: "/components/ui/card", label: "/components/ui/card" },
  { value: "/components/ui/input", label: "/components/ui/input" },
  { value: "/components/ui/label", label: "/components/ui/label" },
  { value: "/components/ui/popover", label: "/components/ui/popover" },
];

interface RepositoryPathSelectorProps {
  name: string;
  required?: boolean;
}

export function RepositoryPathSelector({
  name,
  required,
}: RepositoryPathSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button" // Prevent form submission on click
          >
            {value
              ? paths.find((path) => path.value === value)?.label
              : "Select path..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search path..." />
            <CommandEmpty>No path found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {paths.map((path) => (
                  <CommandItem
                    key={path.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === path.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {path.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Hidden input to store the value for form submission */}
      <input type="hidden" name={name} value={value} required={required} />
    </>
  );
}
