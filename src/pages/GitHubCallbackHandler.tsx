import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      toast({ title: "GitHub login failed", description: "No code found", variant: "destructive" });
      navigate("/repositories");
      return;
    }

    // Reject a callback that did not originate from this browser session.
    if (!expectedState || state !== expectedState) {
      toast({
        title: "GitHub login failed",
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
          toast({ title: "GitHub login failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "GitHub connected!", description: `Welcome, ${data.username}` });
        }
        navigate("/repositories");
      });
  }, [navigate, toast]);

  return <div>Connecting to GitHub...</div>;
}
