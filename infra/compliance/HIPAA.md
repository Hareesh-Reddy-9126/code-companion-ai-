# Code Companion AI — HIPAA Compliance Documentation

## 1. Scope

Code Companion AI Enterprise tier supports HIPAA compliance for healthcare organizations analyzing code that may contain PHI (Protected Health Information).

## 2. Safeguards

### Administrative Safeguards
- Business Associate Agreement (BAA) available upon request
- Workforce training: Annual HIPAA training for all employees
- Access management: Role-based access with least privilege principle
- Security incident procedures: Documented response plan

### Physical Safeguards
- Data center: AWS with physical security controls
- Device controls: Encrypted endpoints for all employees
- Media disposal: Secure deletion of backup media

### Technical Safeguards
- Authentication: Unique user identification, MFA required
- Transmission security: TLS 1.3 for all data in transit
- Encryption at rest: AES-256 for PHI data
- Audit controls: All access to PHI logged and monitored
- Automatic logoff: 15-minute idle timeout

## 3. PHI Handling

### What Constitutes PHI in Code
- Patient identifiers in code comments or strings
- Medical record numbers
- Health insurance information
- Diagnosis or treatment codes

### Requirements for HIPAA Customers
1. Sign BAA before uploading any PHI
2. Enable SAML SSO for access control
3. Configure data residency to US region
4. Review audit logs weekly
5. Report suspected breaches within 24 hours

## 4. Contact

HIPAA Compliance Officer: compliance@codecompanion.ai
BAA Requests: legal@codecompanion.ai
