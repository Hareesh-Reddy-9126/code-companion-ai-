export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-6 animate-slide-in">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">
        Last updated: October 31, 2026
      </p>

      <h2 className="text-xl font-semibold">1. What We Collect</h2>
      <p className="text-muted-foreground">
        Code Companion AI collects your email address (via Supabase Auth), name,
        GitHub username, and encrypted GitHub access token. We do not store your
        GitHub password. Code snippets analyzed are sent to NVIDIA NIM APIs for
        AI processing and are not used to train public models.
      </p>

      <h2 className="text-xl font-semibold">2. How We Use Your Data</h2>
      <ul className="list-disc list-inside text-muted-foreground space-y-2">
        <li>To authenticate you and manage your account.</li>
        <li>To sync your GitHub repositories for analysis.</li>
        <li>To send code to NVIDIA NIM for AI code review and analysis.</li>
        <li>To store analysis reports so you can view them later.</li>
      </ul>

      <h2 className="text-xl font-semibold">3. Data Sharing</h2>
      <p className="text-muted-foreground">
        We do not sell your data. Code submitted for analysis is sent to
        NVIDIA's NIM inference API (a third-party service). Your GitHub access
        token is encrypted at rest and never exposed to the frontend.
      </p>

      <h2 className="text-xl font-semibold">4. Your Rights</h2>
      <p className="text-muted-foreground">
        You can disconnect GitHub at any time, which deletes your encrypted
        token. You can request account deletion by contacting support.
      </p>

      <h2 className="text-xl font-semibold">5. Security</h2>
      <p className="text-muted-foreground">
        All data is stored in Supabase with Row Level Security. GitHub tokens
        are encrypted using AES-256-GCM before storage.
      </p>
    </div>
  );
}
