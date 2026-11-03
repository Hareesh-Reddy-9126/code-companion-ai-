import { LegalPage, LegalSection } from "@/components/site/LegalPage";

const toc = [
  { id: "architecture", label: "1. Architecture" },
  { id: "tokens", label: "2. Token protection" },
  { id: "isolation", label: "3. Data isolation" },
  { id: "auth", label: "4. Authentication" },
  { id: "ai", label: "5. Third-party AI" },
  { id: "retention", label: "6. Retention" },
  { id: "reporting", label: "7. Reporting a vulnerability" },
  { id: "compliance", label: "8. Compliance status" },
  { id: "incident", label: "9. Incident response" },
];

export default function Security() {
  return (
    <LegalPage
      eyebrow="Security"
      title="Security Policy"
      description="How the platform protects credentials and data today, what is still in progress, and how to report a problem. Every claim here is implementable in the public repository."
      updated="November 3, 2026"
      toc={toc}
    >
      <LegalSection id="architecture" number="01" title="Architecture">
        <p>
          The frontend is a static React application served from Cloudflare's
          edge. Authentication and data live in Supabase (Postgres, Auth and Deno
          edge functions). The browser never receives a GitHub access token or
          any server-side secret.
        </p>
        <p>
          Privileged operations — decrypting a GitHub token, calling GitHub,
          invoking NVIDIA — happen inside edge functions using server-only
          secrets.
        </p>
      </LegalSection>

      <LegalSection id="tokens" number="02" title="Token protection">
        <p>
          GitHub OAuth tokens are encrypted with AES-256-GCM before they are
          written to the database. The encryption key is supplied through an edge
          function secret and is never stored in a table or shipped to the
          client. Decryption occurs only within the function that needs to call
          GitHub.
        </p>
        <p>
          Rotating the encryption key invalidates previously stored credentials.
          When that happens, users must reconnect GitHub; the product surfaces
          this rather than failing silently.
        </p>
      </LegalSection>

      <LegalSection id="isolation" number="03" title="Data isolation">
        <p>
          Row-level security is enabled on client-visible tables. Policies scope
          reads and writes to <code>auth.uid()</code>, so one account cannot
          query another account's repositories, analyses or agent runs.
        </p>
        <p>
          The encrypted credential table has no client policies and is reachable
          only with the service role inside edge functions. Public reports are
          opt-in and readable only when explicitly marked public by their owner.
        </p>
      </LegalSection>

      <LegalSection id="auth" number="04" title="Authentication">
        <p>
          Email and password authentication is handled by Supabase Auth, which
          hashes passwords and issues short-lived access tokens with refresh
          tokens. GitHub connection uses OAuth with a per-session{" "}
          <code>state</code> value that is validated on callback to prevent
          cross-site request forgery.
        </p>
        <p>
          Automated password reset is not enabled during the beta because custom
          SMTP is not yet configured. Account recovery is handled manually
          through support.
        </p>
      </LegalSection>

      <LegalSection id="ai" number="05" title="Third-party AI">
        <p>
          Code selected for analysis is sent to NVIDIA NIM inference APIs. Under
          NVIDIA's API terms, inputs and outputs are not used to train public
          models. We send only the files or diffs needed for the requested
          review, not your entire account or unrelated repositories.
        </p>
      </LegalSection>

      <LegalSection id="retention" number="06" title="Retention">
        <p>
          Analyses and reports remain until you delete them or request account
          deletion. Disconnecting GitHub removes the encrypted credential
          immediately. Operational error records are retained for debugging and
          abuse prevention.
        </p>
      </LegalSection>

      <LegalSection id="reporting" number="07" title="Reporting a vulnerability">
        <p>
          Email{" "}
          <a href="mailto:security@codecompanion.ai">security@codecompanion.ai</a>{" "}
          with a description, reproduction steps and impact. Do not open a public
          issue for a suspected vulnerability. We aim to acknowledge reports
          within 72 hours and will coordinate disclosure with you.
        </p>
        <p>
          Please do not access data that is not yours, degrade the service, or
          test against production accounts you do not own.
        </p>
      </LegalSection>

      <LegalSection id="compliance" number="08" title="Compliance status">
        <p>
          Controls are designed around SOC 2 requirements — encryption, least
          privilege, access isolation and operational logging.{" "}
          <strong>SOC 2 Type II certification is in progress and has not been
          completed.</strong>{" "}
          We do not claim a certification we do not hold.
        </p>
        <p>
          The current deployment processes data in the EU (eu-north-1). SAML SSO,
          additional residency regions and self-hosted deployment are roadmap
          items, not current capabilities.
        </p>
      </LegalSection>

      <LegalSection id="incident" number="09" title="Incident response">
        <p>
          Suspected incidents are triaged by severity, contained, and remediated.
          If an incident affects your data, we will notify affected account
          holders without undue delay and describe what happened, what was
          affected, and what we changed.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
