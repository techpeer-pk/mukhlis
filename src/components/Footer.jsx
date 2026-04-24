import { useState } from 'react'
import { GitHubIcon } from './Icons'

export default function Footer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <footer className="w-full max-w-sm mx-auto mt-8 pb-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Built by{' '}
          <a
            href="https://techpeer.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 font-medium underline underline-offset-2 transition-colors"
          >
            TechPeer
          </a>
          {' '}·{' '}
          <a
            href="https://github.com/techpeer-pk/mukhlis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 font-medium underline underline-offset-2 transition-colors"
          >
            <GitHubIcon className="w-3 h-3" /> GitHub
          </a>
          {' '}·{' '}
          <button
            onClick={() => setOpen(true)}
            className="text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 font-medium underline underline-offset-2 transition-colors"
          >
            Disclaimer
          </button>
        </p>
      </footer>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/40 dark:bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Disclaimer</h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              مخلص صرف ایک رابطہ کا ذریعہ ہے۔ ملاقات عوامی جگہ پر کریں۔ ہم کسی بھی نقصان یا دھوکے کے ذمہ دار نہیں۔
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mukhlis is a contact platform only. Always meet in a public place. We are not responsible for any loss, fraud, or misuse arising from this service.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="w-full mt-5 bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
