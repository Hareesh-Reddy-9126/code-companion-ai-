import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Github,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/PageHeader";

export default function SettingsPage() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  const saveName = async () => {
    if (!user) return;
    if (!name.trim()) {
      toast({ title: "Name cannot be empty", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name: name.trim() }).eq("user_id", user.id);
    await refreshProfile();
    setSaving(false);
    if (error) {
      toast({ title: "Could not save your profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved" });
    }
  };

  const updatePassword = async () => {
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least six characters.",
        variant: "destructive",
      });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
    } else {
      setPassword("");
      toast({ title: "Password updated" });
    }
  };

  const connectGitHub = async () => {
    setConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-auth-url?redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        },
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        setConnecting(false);
        toast({
          title: "GitHub is not configured",
          description: data.error || "The authorization endpoint returned an error.",
          variant: "destructive",
        });
        return;
      }
      const state = crypto.randomUUID();
      sessionStorage.setItem("github_oauth_state", state);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${data.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state}`;
    } catch (error: any) {
      setConnecting(false);
      toast({ title: "Could not start GitHub OAuth", description: error.message, variant: "destructive" });
    }
  };

  const disconnectGitHub = async () => {
    if (!window.confirm("Disconnect GitHub? Stored credentials will be deleted and analyses will stop until you reconnect.")) {
      return;
    }
    setDisconnecting(true);
    try {
      const { error } = await supabase.functions.invoke("revoke-github", { body: {} });
      if (error) throw error;
      await refreshProfile();
      toast({ title: "GitHub disconnected", description: "The stored token has been deleted." });
    } catch (error: any) {
      toast({ title: "Failed to disconnect", description: error.message, variant: "destructive" });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Account"
        title="Settings"
        description="Your profile, GitHub connection and account security."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Profile</h2>
          </div>
          <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">
            This name appears on reports and in the workspace switcher.
          </p>

          <div className="mt-5 space-y-4">
            <Field
              icon={User}
              label="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
            <Field
              icon={Mail}
              label="Email"
              value={user?.email || ""}
              disabled
              hint="Managed by Supabase Auth"
            />
          </div>

          <Button className="mt-5" onClick={saveName} disabled={saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save profile
          </Button>
        </section>

        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Github className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">GitHub connection</h2>
          </div>

          {profile?.github_username ? (
            <>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.018] p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <Github className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-foreground">
                    Connected as @{profile.github_username}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-primary">
                    <ShieldCheck className="h-3 w-3" /> Token encrypted at rest
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11.5px] leading-5 text-muted-foreground">
                The OAuth token is encrypted with AES-256-GCM and is only
                decrypted inside edge functions that call GitHub.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={connectGitHub} disabled={connecting}>
                  {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
                  Reconnect
                </Button>
                <Button variant="ghost" size="sm" onClick={disconnectGitHub} disabled={disconnecting}>
                  {disconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                  Disconnect
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-3 text-[11.5px] leading-5 text-muted-foreground">
                Connect GitHub to sync repositories and let the agent read pull
                request diffs. Access can be revoked here or from GitHub at any
                time.
              </p>
              <Button className="mt-4" size="sm" onClick={connectGitHub} disabled={connecting}>
                {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
                Connect GitHub
              </Button>
            </>
          )}
        </section>

        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Password</h2>
          </div>
          <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">
            Set a new password for this account. Automated reset email is not
            enabled during the beta.
          </p>

          <div className="mt-5">
            <Field
              icon={Lock}
              label="New password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              hint="min 6 characters"
            />
          </div>

          <Button
            className="mt-5"
            variant="outline"
            onClick={updatePassword}
            disabled={savingPassword || !password}
          >
            {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
            Update password
          </Button>

          <p className="mt-4 rounded-lg border border-border/60 bg-white/[0.015] p-3 text-[10.5px] leading-5 text-muted-foreground">
            Locked out? Email{" "}
            <a href="mailto:support@codecompanion.ai" className="text-primary hover:underline">
              support@codecompanion.ai
            </a>
            . Recovery is handled manually until SMTP is configured.
          </p>
        </section>

        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Session</h2>
          </div>
          <div className="mt-4 space-y-2.5">
            <InfoRow label="Account" value={user?.email || "—"} />
            <InfoRow
              label="Member since"
              value={
                user?.created_at
                  ? new Date(user.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"
              }
            />
            <InfoRow label="Plan" value="Free public beta" />
            <InfoRow label="Region" value="EU · eu-north-1" />
          </div>

          <Button variant="outline" size="sm" className="mt-5" onClick={handleSignOut}>
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>

          <a
            href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Review the source code <ArrowUpRight className="h-3 w-3" />
          </a>
        </section>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  hint,
  ...props
}: { icon: typeof User; label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-[11.5px] font-medium text-foreground/85">
        {label}
        {hint && <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">{hint}</span>}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
        <Input id={id} className="h-10 pl-9 text-[13px]" {...props} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-[10px] text-foreground/75">{value}</span>
    </div>
  );
}
