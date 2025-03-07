"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverTrigger } from "~/components/ui/popover";
import { PopoverContent } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface UserChoice {
  searchEngine: string;
  updateUserChoice: (searchEngine: string) => Promise<unknown>;
}

const searchEngines = [
  {
    value: "!duck",
    label: "DuckDuckGo",
  },
  {
    value: "!g",
    label: "Google Search",
  },
  {
    value: "!bing",
    label: "Bing",
  },
];

export default function SettingsForm({
  searchEngine,
  updateUserChoice,
}: UserChoice) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchEngine ?? "!duck");

  return (
    <form
      action={async () => {
        await updateUserChoice(value);
        toast.success("Changes applied");
      }}
    >
      <div className="flex flex-col">
        <div className="mb-4 flex">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? searchEngines.find((engine) => engine.value === value)
                      ?.label
                  : "Select a search Engine"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Choose search engine" />
                <CommandList>
                  <CommandEmpty>No engine found</CommandEmpty>
                  <CommandGroup>
                    {searchEngines.map((engine) => (
                      <CommandItem
                        key={engine.value}
                        value={engine.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {engine.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === engine.value
                              ? "opacity-100"
                              : "opacity-0",
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
        <div className="flex">
          <Button type="submit">Apply</Button>
        </div>
      </div>
      <Toaster richColors />
    </form>
  );
}
