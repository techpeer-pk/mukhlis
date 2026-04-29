import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import UserAvatar from '../components/UserAvatar'
import ThemeToggle from '../components/ThemeToggle'
import LanguageToggle from '../components/LanguageToggle'
import ShareButton from '../components/ShareButton'
import HelpModal from '../components/HelpModal'
import { SearchIcon, DocumentIcon } from '../components/Icons'
import Footer from '../components/Footer'

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>
)

export default function Home() {
  const navigate = useNavigate()
  const user = useAuth()
  const { t } = useLanguage()
  const [showHelp, setShowHelp] = useState(false)
  const logout = () => signOut(auth).then(() => navigate('/'))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm">

        <div className="flex justify-between items-center mb-2">
          <ShareButton />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="text-center mb-10">
          <img src="/logo/logo.png" alt="Mukhlis" className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-sm" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('app_name')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('tagline')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">{t('app_desc')}</p>
          <button
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline underline-offset-2 transition-colors"
          >
            <QuestionIcon /> {t('how_it_works')}
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold px-5 py-4 rounded-2xl transition-all shadow-sm"
          >
            <SearchIcon className="w-5 h-5 shrink-0" />
            <span className="text-left">
              {t('lost_doc')}
              <span className="block text-sm font-normal opacity-70 mt-0.5">{t('lost_doc_sub')}</span>
            </span>
          </button>

          <button
            onClick={() => navigate(user ? '/report' : '/login')}
            className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 font-semibold px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all shadow-sm"
          >
            <DocumentIcon className="w-5 h-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="text-left">
              {t('found_doc')}
              <span className="block text-sm font-normal text-slate-400 dark:text-slate-500 mt-0.5">{t('found_doc_sub')}</span>
            </span>
          </button>
        </div>

        {user && (
          <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <UserAvatar user={user} />
              <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">{user.displayName || user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/my-reports')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {t('my_reports')}
              </button>
              <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
              <button onClick={logout} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {t('logout')}
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-6">{t('privacy')}</p>
        <Footer />
      </div>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  )
}
