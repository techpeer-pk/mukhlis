import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()
  return (
    <button
      onClick={toggle}
      className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 transition-colors"
    >
      {lang === 'ur' ? 'EN' : 'اردو'}
    </button>
  )
}
