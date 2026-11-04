import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";

function scorePassword(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = scorePassword(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (!accepted) {
      toast({ title: "Accept the terms", description: "Please accept the terms to continue.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error, session } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      toast({ title: "Account creation failed", description: error.message, variant: "destructive" });
    } else if (session) {
      toast({ title: "Account created", description: "Welcome to Code Companion AI." });
      navigate("/dashboard");
    } else {
      toast({ title: "Check your email", description: "Confirm your address, then sign in." });
      navigate("/login");
    }
  };

  return (
    <AuthShell
      eyebrow="Create an account"
      title="Start your first review."
      description="Free during the public beta. No card, no trial timer, no automatic charge."
      points={[
        "Connect GitHub with OAuth in one click",
        "Run an on-demand review on any repository",
        "Approve every agent suggestion before it ships",
      ]}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          icon={User}
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <AuthField
          icon={Mail}
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <AuthField
          icon={Lock}
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {strength > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
              Strength
            </span>
            <div className="flex-1 h-1 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full bg-brand transition-all duration-300 ${strength === 4 ? "w-full" : ""}`}
                style={{ width: `${(strength / 4) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {strength === 0 ? "" : ["Too short", "Weak", "Fair", "Strong", "Excellent"][strength]}
            </span>
          </div>
        )}
        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-brand focus:ring-brand checked:bg-brand checked:border-brand"
            checked={accepted}
            onChange={() => setAccepted((prev) => !prev)}
          />
          <label htmlFor="terms" className="text-sm text-foreground-muted leading-relaxed">
            I accept the <Link to="/terms" className="text-brand hover:underline">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground/60">
        Already have an account?{" "}
        <Link to="/login" className="text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
