import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageToggle from '../components/LanguageToggle'
import ShareButton from '../components/ShareButton'
import Footer from '../components/Footer'

export default function LoginPage() {
  const navigate = useNavigate()
  const user = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    if (user) navigate('/report', { replace: true })
  }, [user, navigate])

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/report')
    } catch (e) {
      alert('Login failed: ' + e.message)
    }
  }

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

        <div className="text-center mb-8">
          <img src="/logo/logo.png" alt="Mukhlis" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-sm" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('app_name')}</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{t('login_subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-xl transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
            {t('continue_google')}
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-5">
            {t('login_note_1')}<br />{t('login_note_2')}
          </p>
        </div>

        <button onClick={() => navigate('/')} className="w-full text-center mt-5 text-slate-400 dark:text-slate-600 text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          {t('back')}
        </button>
        <Footer />
      </div>
    </div>
  )
}
