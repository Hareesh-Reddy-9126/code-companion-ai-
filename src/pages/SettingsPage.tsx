import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Github, Save, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(profile?.name || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (name !== profile?.name) {
        await supabase.from("profiles").update({ name }).eq("user_id", user!.id);
      }
      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      }
      await refreshProfile();
      setPassword("");
      toast({ title: "Settings saved!" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const disconnectGitHub = async () => {
    setDisconnecting(true);
    try {
      await supabase.from("profiles").update({
        github_username: null,
        github_access_token: null,
      }).eq("user_id", user!.id);
      await refreshProfile();
      toast({ title: "GitHub disconnected" });
    } catch (e: any) {
      toast({ title: "Failed to disconnect", description: e.message, variant: "destructive" });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h3 className="font-semibold">Profile</h3>
        <FormField icon={User} label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <FormField icon={Mail} label="Email" value={user?.email || ""} disabled />
        <FormField icon={Lock} label="New Password" placeholder="Enter new password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="mt-2" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-3">GitHub Connection</h3>
        {profile?.github_username ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Github className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Connected as @{profile.github_username}</p>
                <p className="text-xs text-muted-foreground">GitHub account linked</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectGitHub} disabled={disconnecting}>
              {disconnecting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <LogOut className="h-3 w-3 mr-1" />}
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">No GitHub account connected</p>
            <Button
              size="sm"
              onClick={async () => {
                try {
                  const redirectUri = `http://localhost:8080/auth/github/callback`;
                  const res = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-auth-url?redirect_uri=${encodeURIComponent(redirectUri)}`,
                    { headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } }
                  );
                  const data = await res.json();
                  if (data.error) {
                    toast({ title: "Not configured", description: data.error, variant: "destructive" });
                    return;
                  }
                  window.location.href = `https://github.com/login/oauth/authorize?client_id=${data.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
                } catch (e: any) {
                  toast({ title: "Error", description: e.message, variant: "destructive" });
                }
              }}
            >
              <Github className="h-4 w-4 mr-2" /> Connect GitHub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ icon: Icon, label, ...props }: { icon: any; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 border border-border/50">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <input className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" {...props} />
      </div>
    </div>
  );
}
