import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function GitHubCallbackHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      toast({ title: "GitHub login failed", description: "No code found", variant: "destructive" });
      navigate("/repositories");
      return;
    }
    // Call your backend to finish login
    supabase.functions.invoke("github-callback", { body: JSON.stringify({ code }) })
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
