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
      toast({ title: "Password updated" });
      setPassword("");
    }
  };

  const connectGitHub = async () => {
    setConnecting(true);
    try {
      const { error } = await supabase.functions.invoke("github-app-auth", { body: {} });
      if (error) throw error;
      navigate("/repositories");
    } catch (error: any) {
      toast({ title: "GitHub connection failed", description: error.message, variant: "destructive" });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectGitHub = async () => {
    setDisconnecting(true);
    try {
      const { error } = await supabase.from("profiles").update({ github_username: null }).eq("user_id", user?.id);
      if (error) throw error;
      await refreshProfile();
      toast({ title: "GitHub disconnected" });
    } catch (error: any) {
      toast({ title: "Could not disconnect", description: error.message, variant: "destructive" });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const firstName = profile?.name?.split(" ")[0] || user?.email?.split("@")[0];

  return (
    <div className="relative">
      <PageHeader
        group="Account"
        title="Settings"
        description={`Manage your account, ${firstName}.`}
        actions={
          <Button variant="outline" asChild onClick={handleSignOut}>
            <span>Sign out <LogOut className="h-3.5 w-3.5" /></span>
          </Button>
        }
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Profile
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Account details</h2>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); saveName(); }} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
          </Button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Password
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Change password</h2>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); updatePassword(); }} className="space-y-4">
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" size="sm" disabled={savingPassword}>
            {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
          </Button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Connected accounts
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">GitHub</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
            <Github className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {profile?.github_username ? `@${profile.github_username}` : "Not connected"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {profile?.github_username ? "Connected via OAuth" : "Connect to analyze repositories"}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {profile?.github_username ? (
              <Button variant="outline" size="sm" disabled={disconnecting} onClick={disconnectGitHub}>
                {disconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Disconnect"}
              </Button>
            ) : (
              <Button size="sm" disabled={connecting} onClick={connectGitHub}>
                {connecting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" /> Connect
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
