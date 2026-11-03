import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/brand/Logo";
import { Check, Loader2 } from "lucide-react";

const STATE_KEY = "github_oauth_state";

export default function GitHubCallbackHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const expectedState = sessionStorage.getItem(STATE_KEY);

    sessionStorage.removeItem(STATE_KEY);

    if (!code) {
      toast({ title: "GitHub connection failed", description: "No authorization code was returned.", variant: "destructive" });
      navigate("/repositories");
      return;
    }

    // Reject a callback that did not originate from this browser session.
    if (!expectedState || state !== expectedState) {
      toast({
        title: "GitHub connection failed",
        description: "The authorization request could not be verified. Please try again.",
        variant: "destructive",
      });
      navigate("/repositories");
      return;
    }

    supabase.functions
      .invoke("github-callback", { body: { code } })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "GitHub connection failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "GitHub connected", description: `Signed in as ${data.username}.` });
        }
        navigate("/repositories");
      });
  }, [navigate, toast]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[110px]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-panel">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              github oauth
            </span>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          </div>
          <div className="p-6">
            <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
              Connecting your GitHub account
            </h1>
            <p className="mt-2 text-[12.5px] leading-6 text-muted-foreground">
              Verifying the authorization request and storing your token
              encrypted. This takes a moment.
            </p>

            <div className="mt-5 space-y-2.5">
              {[
                { label: "Authorization state verified", done: true },
                { label: "Exchanging code for a token", done: true },
                { label: "Encrypting credentials", done: false },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      step.done
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step.done ? <Check className="h-2.5 w-2.5" /> : <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                  </span>
                  <span className={`text-[11.5px] ${step.done ? "text-foreground/80" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border/60 bg-white/[0.015] px-5 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">
              token never reaches the browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
