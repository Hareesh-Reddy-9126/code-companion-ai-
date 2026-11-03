import { useNavigate } from "react-router-dom";
import { ExternalLink, LogOut, Search, Terminal } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { appNavGroups, quickActions } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const go = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <Terminal className="h-3 w-3" /> Command
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          <kbd className="kbd">esc</kbd> to close
        </span>
      </div>
      <CommandInput placeholder="Search pages and actions…" />
      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty className="py-10 text-center text-[13px] text-muted-foreground">
          No results. Try “security” or “billing”.
        </CommandEmpty>

        <CommandGroup heading="Quick actions">
          {quickActions.map((item) => (
            <CommandItem
              key={item.title}
              value={item.title}
              onSelect={() => go(item.url)}
              className="gap-3 rounded-lg px-3 py-2.5"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        {appNavGroups.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.items.map((item) => (
              <CommandItem
                key={item.url}
                value={`${group.label} ${item.title}`}
                onSelect={() => go(item.url)}
                className="gap-3 rounded-lg px-3 py-2.5"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.title}</span>
                {item.shortcut && <CommandShortcut>G {item.shortcut}</CommandShortcut>}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}

        <CommandSeparator className="my-2" />

        <CommandGroup heading="Resources">
          <CommandItem
            value="documentation api docs"
            onSelect={() => go("/docs")}
            className="gap-3 rounded-lg px-3 py-2.5"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span>Documentation</span>
          </CommandItem>
          <CommandItem
            value="github repository source"
            onSelect={() => {
              onOpenChange(false);
              window.open("https://github.com/Hareesh-Reddy-9126/code-companion-ai-", "_blank", "noreferrer");
            }}
            className="gap-3 rounded-lg px-3 py-2.5"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span>GitHub repository</span>
          </CommandItem>
          <CommandItem
            value="sign out log out"
            onSelect={async () => {
              onOpenChange(false);
              await signOut();
              navigate("/login");
            }}
            className="gap-3 rounded-lg px-3 py-2.5 text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
