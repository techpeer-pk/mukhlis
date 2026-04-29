import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const ShareIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
  </svg>
)

const DownloadIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
)

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const isIOS = () => /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

export default function InstallPrompt() {
  const { t } = useLanguage()
  const [prompt, setPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [showIOS, setShowIOS] = useState(false)

  useEffect(() => {
    if (isInStandaloneMode()) return
    if (sessionStorage.getItem('pwa-dismissed-session')) return

    if (isIOS()) {
      setTimeout(() => setShowIOS(true), 5000)
      return
    }

    const handler = e => {
      e.preventDefault()
      setPrompt(e)
      setTimeout(() => setShow(true), 5000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    setShow(false)
    setShowIOS(false)
    sessionStorage.setItem('pwa-dismissed-session', '1')
  }

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setShow(false)
  }

  if (!show && !showIOS) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-5 pointer-events-auto animate-slide-up">

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/logo/logo.png" alt="Mukhlis" className="w-12 h-12 rounded-xl shadow-sm" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">مخلص — Mukhlis</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">immukhlis.web.app</p>
            </div>
          </div>
          <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
            <XIcon />
          </button>
        </div>

        {show && (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{t('install_text')}</p>
            <div className="flex gap-2">
              <button
                onClick={install}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 text-white font-semibold py-3 rounded-xl text-sm transition-all"
              >
                <DownloadIcon className="w-4 h-4" /> {t('install')}
              </button>
              <button
                onClick={dismiss}
                className="px-4 border border-gray-200 dark:border-gray-600 text-slate-500 dark:text-slate-400 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('later')}
              </button>
            </div>
          </>
        )}

        {showIOS && (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{t('ios_title')}</p>
            <ol className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                {t('ios_step1')} <ShareIcon className="w-4 h-4 mx-1 text-blue-500" />
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                {t('ios_step2')}
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                {t('ios_step3')}
              </li>
            </ol>
            <button
              onClick={dismiss}
              className="w-full border border-gray-200 dark:border-gray-600 text-slate-500 dark:text-slate-400 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('ok')}
            </button>
          </>
        )}

      </div>
    </div>
  )
}
