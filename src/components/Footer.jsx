import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { GitHubIcon } from './Icons'
import HelpModal from './HelpModal'

const QuestionIcon = ({ className = 'w-3 h-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>
)

const GlobeIcon = ({ className = 'w-3 h-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
)

const ShieldIcon = ({ className = 'w-3 h-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
)

export default function Footer() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [help, setHelp] = useState(false)

  return (
    <>
      <footer className="w-full max-w-sm mx-auto mt-8 pb-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          {t('built_by')}{' '}
          <a
            href="https://techpeer.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 font-medium underline underline-offset-2 transition-colors"
          >
            <GlobeIcon /> TechPeer
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
            className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 font-medium underline underline-offset-2 transition-colors"
          >
            <ShieldIcon /> {t('disclaimer')}
          </button>
          {' '}·{' '}
          <button
            onClick={() => setHelp(true)}
            className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 font-medium underline underline-offset-2 transition-colors"
          >
            <QuestionIcon /> {t('help_link')}
          </button>
        </p>
      </footer>

      {help && <HelpModal onClose={() => setHelp(false)} />}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/40 dark:bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">{t('disclaimer_title')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              {t('disclaimer_text_1')}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="w-full mt-5 bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl text-sm font-semibold"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
