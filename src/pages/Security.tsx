export default function Security() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-6 animate-slide-in">
      <h1 className="text-3xl font-bold">Security</h1>
      <p className="text-muted-foreground">
        Last updated: October 31, 2026
      </p>

      <h2 className="text-xl font-semibold">1. Encryption at Rest</h2>
      <p className="text-muted-foreground">
        GitHub access tokens are encrypted using AES-256-GCM before being stored
        in Supabase. Encryption keys are managed via environment variables and
        are never stored in the database.
      </p>

      <h2 className="text-xl font-semibold">2. Row Level Security (RLS)</h2>
      <p className="text-muted-foreground">
        All database tables enforce RLS. Users can only access their own data.
        Public analyses are opt-in and explicitly marked public by the user.
      </p>

      <h2 className="text-xl font-semibold">3. Third-Party AI</h2>
      <p className="text-muted-foreground">
        Code is sent to NVIDIA NIM inference APIs for analysis. NVIDIA's free
        tier is used for prototyping; no code is used to train public models
        under NVIDIA's terms.
      </p>

      <h2 className="text-xl font-semibold">4. Vulnerability Reporting</h2>
      <p className="text-muted-foreground">
        Report security issues to security@codecompanion.ai. We will respond
        within 72 hours.
      </p>
    </div>
  );
}
