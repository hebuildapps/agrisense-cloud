"use client";

import { useEffect, useMemo, useState } from "react";
import { Command, KeyRound, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ProviderKey = "openai" | "claude" | "groq";

type ProfileSettings = {
  username: string;
  apiKeys: Record<ProviderKey, string>;
};

const STORAGE_KEY = "agrisense.profile.settings";

const DEFAULT_SETTINGS: ProfileSettings = {
  username: "username",
  apiKeys: {
    openai: "",
    claude: "",
    groq: "",
  },
};

const PROVIDERS: Array<{
  key: ProviderKey;
  label: string;
  placeholder: string;
  helper: string;
}> = [
  {
    key: "openai",
    label: "OpenAI",
    placeholder: "sk-proj-...",
    helper: "Used for GPT-style workflows and synthesis helpers.",
  },
  {
    key: "claude",
    label: "Claude",
    placeholder: "sk-ant-...",
    helper: "Useful for long-context reading and summarization tasks.",
  },
  {
    key: "groq",
    label: "Groq",
    placeholder: "gsk_...",
    helper: "Handy for low-latency experiments and fast local-feeling responses.",
  },
];

function getInitials(username: string): string {
  const words = username.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
  return initials || "R";
}

export function ProfileSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<ProfileSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const parsedValue = JSON.parse(storedValue) as Partial<ProfileSettings>;
        setSettings({
          username: parsedValue.username?.trim() || DEFAULT_SETTINGS.username,
          apiKeys: {
            openai: parsedValue.apiKeys?.openai || "",
            claude: parsedValue.apiKeys?.claude || "",
            groq: parsedValue.apiKeys?.groq || "",
          },
        });
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [isLoaded, settings]);

  const initials = useMemo(() => getInitials(settings.username), [settings.username]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-2 py-1.5 text-left shadow-sm transition-all",
          "hover:border-primary/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-foreground to-foreground/65 text-xs font-semibold text-background">
          {initials}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-medium leading-none">{settings.username}</p>
        </div>
      </button>

      <DialogContent className="sm:max-w-180">
        <DialogHeader className="pr-10">
          <DialogTitle className="text-lg">Profile and provider keys</DialogTitle>
          <DialogDescription>
            Use this panel to set the username shown in the interface and store API keys for the providers you want to switch between.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-[160px_minmax(0,1fr)] md:items-start">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-3 md:flex-col md:items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
                {initials}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="profile-username" className="text-sm font-medium">
                  Username
                </label>
              </div>
              <Input
                id="profile-username"
                value={settings.username}
                onChange={(event) =>
                  setSettings((previous) => ({
                    ...previous,
                    username: event.target.value,
                  }))
                }
                placeholder="your name"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                This name appears in the top bar and is written to browser storage on this device only.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium">API keys</h3>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-[0.2em]">
                  <KeyRound className="mr-1 h-3 w-3" />
                  openai / claude / groq
                </Badge>
              </div>

              <div className="mt-4 space-y-4">
                {PROVIDERS.map((provider) => (
                  <div key={provider.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label htmlFor={`api-key-${provider.key}`} className="text-sm font-medium">
                        {provider.label}
                      </label>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Stored locally
                      </span>
                    </div>
                    <Input
                      id={`api-key-${provider.key}`}
                      type="password"
                      value={settings.apiKeys[provider.key]}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          apiKeys: {
                            ...previous.apiKeys,
                            [provider.key]: event.target.value,
                          },
                        }))
                      }
                      placeholder={provider.placeholder}
                      className="h-10 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">{provider.helper}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-900 dark:text-emerald-200">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <Command className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Storage note</p>
                  <p className="text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
                    Everything in this dialog is saved in browser storage. Close and reopen the page, and the username plus provider keys should still be there on this device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileSettingsDialog;