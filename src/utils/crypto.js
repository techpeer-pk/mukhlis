import CryptoJS from 'crypto-js'

const KEY = import.meta.env.VITE_ENCRYPTION_KEY

export function encrypt(text) {
  if (!text) return ''
  return CryptoJS.AES.encrypt(String(text), KEY).toString()
}

export function decrypt(ciphertext) {
  if (!ciphertext) return ''
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

// Primary hash — normalized (strips dashes/spaces) for new records & anykey search
export function hash(text) {
  const normalized = String(text).trim().toLowerCase().replace(/[\s\-_.]/g, '')
  return CryptoJS.SHA256(normalized).toString()
}

// Raw hash — for backward compat with old records stored with dashes
export function hashRaw(text) {
  return CryptoJS.SHA256(String(text).trim().toLowerCase()).toString()
}
