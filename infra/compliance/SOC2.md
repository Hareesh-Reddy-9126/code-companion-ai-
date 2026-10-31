# Code Companion AI — SOC2 Type II Compliance Documentation

## 1. Security Policy

### Access Control
- All access requires multi-factor authentication (MFA)
- Role-Based Access Control (RBAC): Admin, Developer, Viewer, Billing
- SAML SSO integration supported (Okta, Azure AD, Google Workspace)
- Session timeout: 30 minutes idle
- API key rotation: Every 90 days

### Data Encryption
- At rest: AES-256-GCM encryption for all stored data
- In transit: TLS 1.3 for all API communications
- GitHub access tokens encrypted before storage
- Encryption keys managed via environment variables, never in database

### Audit Logging
- All user actions logged with timestamp, user ID, action type, resource
- Log retention: 1 year
- Logs exported to SIEM (Splunk, Datadog, or ELK)

### Incident Response
- Severity levels: Critical, High, Medium, Low
- Response time: Critical < 1 hour, High < 4 hours
- Customer notification: < 24 hours for data breaches
- Post-mortem documentation required for all incidents

## 2. Data Processing

### Data Categories
- User profiles (email, name, avatar)
- Repository metadata (name, language, stars, description)
- Analysis reports (scores, security issues, suggestions)
- GitHub access tokens (encrypted at rest)

### Data Retention
- Active accounts: Data retained indefinitely
- Deleted accounts: All data purged within 30 days
- Analysis reports: Retained for account lifetime
- Error logs: Retained for 90 days

### Third-Party Subprocessors
- Supabase: Database and authentication
- NVIDIA NIM: AI model inference (code sent for analysis)
- Cloudflare: CDN and edge computing
- Stripe: Payment processing

## 3. Compliance Certifications

- SOC2 Type II: Certified (annual audit)
- GDPR: Compliant (right to erasure, data portability)
- CCPA: Compliant (California consumer privacy)
- HIPAA: Available for Enterprise tier (BAA agreement)

## 4. Security Contact

Report vulnerabilities to: security@codecompanion.ai
Response time: < 72 hours
Bug bounty: Available via HackerOne
