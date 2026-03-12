import { Bot, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email to confirm your account." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            Create your <span className="text-primary">account</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Start reviewing code with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <AuthField icon={User} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <AuthField icon={Mail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <AuthField icon={Lock} type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"} {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function AuthField({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2.5 border border-border/50">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <input className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" {...props} />
    </div>
  );
}
