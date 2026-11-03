import { LegalPage, LegalSection } from "@/components/site/LegalPage";

const toc = [
  { id: "collect", label: "1. What we collect" },
  { id: "use", label: "2. How we use it" },
  { id: "processing", label: "3. Code processing" },
  { id: "sharing", label: "4. Sub-processors" },
  { id: "retention", label: "5. Retention" },
  { id: "rights", label: "6. Your rights" },
  { id: "cookies", label: "7. Cookies and storage" },
  { id: "transfers", label: "8. International transfers" },
  { id: "changes", label: "9. Changes and contact" },
];

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="What Code Companion AI collects, why it needs it, where it goes and how to get it removed. Written to be read, not to be survived."
      updated="November 3, 2026"
      toc={toc}
    >
      <LegalSection id="collect" number="01" title="What we collect">
        <p>We collect the minimum needed to run the product:</p>
        <ul>
          <li>
            <strong>Account details</strong> — your name, email address and
            authentication metadata, managed by Supabase Auth.
          </li>
          <li>
            <strong>GitHub identity</strong> — your GitHub username and profile
            identifier when you connect GitHub through OAuth. We never receive
            your GitHub password.
          </li>
          <li>
            <strong>Encrypted GitHub token</strong> — an OAuth access token used
            to read repository contents and post review comments. It is
            encrypted with AES-256-GCM before storage.
          </li>
          <li>
            <strong>Repository metadata</strong> — names, languages, stars and
            the files fetched for an analysis you request.
          </li>
          <li>
            <strong>Analysis output</strong> — scores, findings, summaries and
            agent suggestions generated for your account.
          </li>
          <li>
            <strong>Operational records</strong> — analysis job status and error
            events used to operate and debug the service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="use" number="02" title="How we use it">
        <ul>
          <li>To authenticate you and keep your session secure.</li>
          <li>To sync the repositories you choose and run requested analyses.</li>
          <li>To generate review findings and agent suggestions.</li>
          <li>To store reports so you can revisit or share them.</li>
          <li>To diagnose failures and protect the service from abuse.</li>
        </ul>
        <p>
          We do not sell personal data, run advertising trackers, or use your
          code to train our own models.
        </p>
      </LegalSection>

      <LegalSection id="processing" number="03" title="Code processing and AI">
        <p>
          When you request an analysis, relevant repository files or pull
          request diffs are sent to NVIDIA NIM inference APIs to produce the
          review. That processing is necessary to deliver the feature you asked
          for. Under NVIDIA's API terms, inputs and outputs are not used to
          train public models.
        </p>
        <p>
          Analysis output may include excerpts of your code in findings and fix
          suggestions. That output is stored in your account and is private
          unless you explicitly publish a report.
        </p>
      </LegalSection>

      <LegalSection id="sharing" number="04" title="Sub-processors">
        <p>We use a small, named set of infrastructure providers:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — Postgres, authentication and edge
            functions, hosted in the EU (eu-north-1).
          </li>
          <li>
            <strong>NVIDIA NIM</strong> — model inference for code analysis.
          </li>
          <li>
            <strong>Cloudflare</strong> — static site delivery and edge routing.
          </li>
          <li>
            <strong>GitHub</strong> — OAuth, repository access and review
            comments you ask us to post.
          </li>
        </ul>
        <p>
          We disclose data otherwise only when legally required, and we will
          tell you unless prohibited from doing so.
        </p>
      </LegalSection>

      <LegalSection id="retention" number="05" title="Retention and deletion">
        <p>
          Account data and analyses are retained while your account is active.
          Disconnecting GitHub deletes the stored encrypted credential
          immediately. Deleting an analysis removes its stored report.
        </p>
        <p>
          To delete your account and associated records, email{" "}
          <a href="mailto:privacy@codecompanion.ai">privacy@codecompanion.ai</a>{" "}
          from the address on the account. We aim to complete verified deletion
          requests within 30 days, excluding records we must retain for legal or
          security reasons.
        </p>
      </LegalSection>

      <LegalSection id="rights" number="06" title="Your rights">
        <p>
          Depending on where you live, you may have the right to access, correct,
          export or delete your personal data, or to object to certain
          processing. You can exercise most of these directly in Settings, or by
          contacting us. We will not discriminate against you for exercising a
          privacy right.
        </p>
      </LegalSection>

      <LegalSection id="cookies" number="07" title="Cookies and local storage">
        <p>
          We use browser storage for authentication sessions and for a short-lived
          OAuth state value that protects the GitHub connection flow. We do not
          set advertising cookies or third-party analytics cookies.
        </p>
      </LegalSection>

      <LegalSection id="transfers" number="08" title="International transfers">
        <p>
          Account and analysis data are hosted in the EU. Inference through
          NVIDIA may involve processing outside the EU. Where required, transfers
          rely on the provider's standard contractual clauses.
        </p>
      </LegalSection>

      <LegalSection id="changes" number="09" title="Changes and contact">
        <p>
          If this policy changes materially, we will update the date above and
          notify account holders by email or in-product before the change takes
          effect.
        </p>
        <p>
          Privacy questions:{" "}
          <a href="mailto:privacy@codecompanion.ai">privacy@codecompanion.ai</a>.
          Security reports:{" "}
          <a href="mailto:security@codecompanion.ai">security@codecompanion.ai</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
