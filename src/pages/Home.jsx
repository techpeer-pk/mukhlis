import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/UserAvatar'
import ThemeToggle from '../components/ThemeToggle'
import ShareButton from '../components/ShareButton'
import { SearchIcon, DocumentIcon } from '../components/Icons'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate()
  const user = useAuth()
  const logout = () => signOut(auth).then(() => navigate('/'))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm">

        <div className="flex justify-between items-center mb-2">
          <ShareButton />
          <ThemeToggle />
        </div>

        <div className="text-center mb-10">
          <img src="/logo/logo.png" alt="Mukhlis" className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-sm" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">مخلص</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ایمانداری سے واپسی · Find with Trust</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold px-5 py-4 rounded-2xl transition-all shadow-sm"
          >
            <SearchIcon className="w-5 h-5 shrink-0" />
            <span className="text-left">
              میں نے کاغذ کھویا
              <span className="block text-sm font-normal opacity-70 mt-0.5">I Lost a Document</span>
            </span>
          </button>

          <button
            onClick={() => navigate(user ? '/report' : '/login')}
            className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 font-semibold px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all shadow-sm"
          >
            <DocumentIcon className="w-5 h-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="text-left">
              میں نے کاغذ پایا
              <span className="block text-sm font-normal text-slate-400 dark:text-slate-500 mt-0.5">I Found a Document</span>
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
                My Reports
              </button>
              <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
              <button onClick={logout} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-6">No personal data stored · Privacy first</p>
        <Footer />
      </div>
    </div>
  )
}
