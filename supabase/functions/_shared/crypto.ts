import { ENCRYPTION_KEY } from "./env.ts";

const ALGORITHM = "AES-GCM";
const KEY_BITS = 256;

/**
 * Derive a crypto key from the ENCRYPTION_KEY env var.
 */
async function getCryptoKey(): Promise<CryptoKey> {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY env var is required for token encryption");
  }
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPTION_KEY),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const salt = enc.encode("code-companion-ai-token-v1");
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_BITS },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Encrypt a plaintext string. Returns base64(iv + ciphertext).
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = enc.encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded,
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64(iv + ciphertext) string back to plaintext.
 */
export async function decrypt(ciphertextB64: string): Promise<string> {
  const key = await getCryptoKey();
  const combined = new Uint8Array(
    atob(ciphertextB64).split("").map((c) => c.charCodeAt(0)),
  );
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(decrypted);
}
