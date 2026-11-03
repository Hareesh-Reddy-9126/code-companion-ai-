import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Loader2, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";

const strengthLabels = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

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

  const strength = useMemo(() => scorePassword(password), [password]);

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
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          icon={User}
          label="Full name"
          placeholder="Ada Lovelace"
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
        <div>
          <AuthField
            icon={Lock}
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            hint={password ? strengthLabels[strength] : "min 6 characters"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className="mt-2 flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={`h-0.5 flex-1 rounded-full transition-colors ${
                  password && index < strength
                    ? strength <= 1
                      ? "bg-destructive/70"
                      : strength === 2
                        ? "bg-warning/70"
                        : "bg-primary/80"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[11.5px] leading-5 text-muted-foreground">
          <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="peer h-4 w-4 appearance-none rounded border border-input bg-white/[0.02] transition-colors checked:border-primary checked:bg-primary"
              required
            />
            <Check className="pointer-events-none absolute h-2.5 w-2.5 text-primary-foreground opacity-0 peer-checked:opacity-100" />
          </span>
          <span>
            I agree to the{" "}
            <Link to="/terms" className="text-foreground/85 underline decoration-border underline-offset-4 hover:decoration-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-foreground/85 underline decoration-border underline-offset-4 hover:decoration-primary">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
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

      <p className="mt-5 text-center font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-muted-foreground/50">
        Email confirmation may be required · GitHub is connected after signup
      </p>
    </AuthShell>
  );
}
