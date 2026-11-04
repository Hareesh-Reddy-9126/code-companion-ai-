import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace."
      description="Pick up where your last review left off."
      footer={
        <>
          New to Code Companion?{" "}
          <Link to="/signup" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground/60">
        Trouble signing in? Email{" "}
        <a href="mailto:support@codecompanion.ai" className="text-brand hover:underline">
          support@codecompanion.ai
        </a>
        . Automated password reset is not enabled during the beta.
      </p>
    </AuthShell>
  );
}
