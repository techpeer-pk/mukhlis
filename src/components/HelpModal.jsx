import { useLanguage } from '../context/LanguageContext'

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

export default function HelpModal({ onClose }) {
  const { t } = useLanguage()
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75"
      onClick={onClose}
    >
      <div
        className="animate-slide-down w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('help_title')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t('help_sub')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/XkFh-8ya-YY?autoplay=1&rel=0&modestbranding=1"
            title="Mukhlis — How it works"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="px-4 py-3 space-y-2">
          {[t('help_step1'), t('help_step2'), t('help_step3')].map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-xs">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 dark:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-semibold"
          >
            {t('understood')}
          </button>
        </div>
      </div>
    </div>
  )
}
