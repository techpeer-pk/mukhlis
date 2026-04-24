import { useState, useEffect, useRef } from 'react'
import { ShareIcon, LinkIcon, WhatsAppIcon, CheckIcon } from './Icons'

const SHARE_URL = 'https://immukhlis.web.app/'
const SHARE_TEXT = 'مخلص — Pakistan mein khoye hue documents dhundne ka aasaan tareeqa.'

const NativeIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
)

export default function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopied(true)
      setTimeout(() => { setCopied(false); setOpen(false) }, 1500)
    } catch {
      setOpen(false)
    }
  }

  const whatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + '\n' + SHARE_URL)}`, '_blank', 'noopener')
    setOpen(false)
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: 'مخلص — Mukhlis', text: SHARE_TEXT, url: SHARE_URL })
    } catch {}
    setOpen(false)
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        aria-label="Share"
      >
        <ShareIcon className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {copied
              ? <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
              : <LinkIcon className="w-4 h-4 shrink-0" />
            }
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={whatsapp}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0 text-green-500" />
            WhatsApp
          </button>

          {hasNativeShare && (
            <button
              onClick={nativeShare}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
            >
              <NativeIcon className="w-4 h-4 shrink-0" />
              More options
            </button>
          )}
        </div>
      )}
    </div>
  )
}
