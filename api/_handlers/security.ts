import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ALGORITHM = 'aes-256-gcm';

// Obtain encryption key from environment variable
// Must be 32 bytes (256 bits) for AES-256
const rawKey = process.env.DB_ENCRYPTION_KEY;
let ENCRYPTION_KEY: Buffer;

if (rawKey) {
  // If the key is provided, ensure it is 32 bytes (either raw string padded/sliced or hex/base64 parsed)
  if (rawKey.length === 64) {
    // If it looks like a hex string, parse it
    ENCRYPTION_KEY = Buffer.from(rawKey, 'hex');
  } else {
    // Otherwise, hash it to get a deterministic 32-byte key
    ENCRYPTION_KEY = crypto.createHash('sha256').update(rawKey).digest();
  }
} else {
  // Hardcoded secure development key fallback
  console.warn('[SECURITY] Warning: DB_ENCRYPTION_KEY is not defined in environment variables. Using development fallback key.');
  ENCRYPTION_KEY = crypto.createHash('sha256').update('blackcypher-dev-default-secure-key-2026').digest();
}

/**
 * Encrypts cleartext using AES-256-GCM
 * Returns string formatted as ivHex:ciphertextHex:tagHex
 */
export function encrypt(text: string): string {
  if (text === null || text === undefined) return text;
  const str = String(text);
  if (str.trim() === '') return str;

  try {
    const iv = crypto.randomBytes(12); // GCM standard IV length is 12 bytes
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    return str; // Fallback to raw string on error
  }
}

/**
 * Decrypts ciphertext formatted as ivHex:ciphertextHex:tagHex back to cleartext.
 * Gracefully returns the original string if it is not encrypted or if decryption fails.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;
  
  const parts = String(encryptedText).split(':');
  // An AES-256-GCM string will have exactly 3 parts: iv, ciphertext, and authentication tag
  if (parts.length !== 3) {
    return encryptedText; // Gracefully return as-is
  }

  const [ivHex, encryptedHex, authTagHex] = parts;
  const hexRegex = /^[0-9a-fA-F]+$/;

  // Validation: IV for GCM is 12 bytes (24 hex characters), auth tag is 16 bytes (32 hex characters)
  if (
    ivHex.length !== 24 ||
    authTagHex.length !== 32 ||
    !hexRegex.test(ivHex) ||
    !hexRegex.test(authTagHex) ||
    !hexRegex.test(encryptedHex)
  ) {
    return encryptedText; // Not an encrypted block, return exactly as-is
  }

  try {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err: any) {
    // If decryption fails (e.g. wrong key, tampered data), return as-is
    console.warn('[SECURITY] Decryption failed, returning ciphertext as fallback.', err.message);
    return encryptedText;
  }
}
