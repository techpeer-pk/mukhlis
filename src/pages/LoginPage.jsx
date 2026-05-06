import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageToggle from '../components/LanguageToggle'
import ShareButton from '../components/ShareButton'
import { ArrowLeftIcon, PhoneIcon } from '../components/Icons'
import Footer from '../components/Footer'

const toE164 = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('92')) return '+' + digits
  if (digits.startsWith('0')) return '+92' + digits.slice(1)
  return '+92' + digits
}

const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const user = useAuth()
  const { t } = useLanguage()
  const [step, setStep] = useState('options')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    if (user) navigate('/report', { replace: true })
  }, [user, navigate])

  const loginWithGoogle = async () => {
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/report')
    } catch (e) {
      setError(e.message)
    }
  }

  const sendOtp = async () => {
    if (!phone.trim()) return
    setLoading(true)
    setError(null)
    try {
      setupRecaptcha()
      const result = await signInWithPhoneNumber(auth, toE164(phone), window.recaptchaVerifier)
      setConfirmation(result)
      setStep('otp')
    } catch (e) {
      setError(e.message)
      window.recaptchaVerifier = null
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length < 6) return
    setLoading(true)
    setError(null)
    try {
      await confirmation.confirm(otp)
      navigate('/report')
    } catch {
      setError(t('otp_invalid'))
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => { setStep('options'); setPhone(''); setOtp(''); setError(null); window.recaptchaVerifier = null }

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

          {step === 'options' && (
            <>
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-xl transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
                {t('continue_google')}
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500">{t('or')}</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              <button
                onClick={() => setStep('phone')}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-xl transition-all"
              >
                <PhoneIcon className="w-5 h-5" />
                {t('continue_phone')}
              </button>

              {error && <p className="text-xs text-red-500 text-center mt-4">{error}</p>}

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-5">
                {t('login_note_1')}<br />{t('login_note_2')}
              </p>
            </>
          )}

          {step === 'phone' && (
            <>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('enter_your_phone')}</p>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                placeholder="03XX-XXXXXXX"
                autoFocus
                className="w-full border border-gray-200 dark:border-gray-600 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl px-4 py-3 outline-none bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 transition-colors mb-3 text-sm"
              />
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
              <button
                onClick={sendOtp}
                disabled={loading || !phone.trim()}
                className="w-full bg-slate-800 dark:bg-slate-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                {loading ? t('loading') : t('send_otp')}
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{t('enter_otp')}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{toE164(phone)}</p>
              <input
                type="number"
                value={otp}
                onChange={e => setOtp(e.target.value.slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                placeholder="------"
                autoFocus
                className="w-full border border-gray-200 dark:border-gray-600 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl px-4 py-3 outline-none bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 transition-colors mb-3 text-center tracking-widest text-lg font-bold"
              />
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full bg-slate-800 dark:bg-slate-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                {loading ? t('loading') : t('verify_otp')}
              </button>
              <button onClick={goBack} className="mt-3 w-full text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                {t('change_number')}
              </button>
            </>
          )}
        </div>

        <div id="recaptcha-container" />

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-1.5 mt-5 text-slate-400 dark:text-slate-600 text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          <ArrowLeftIcon /> {t('back')}
        </button>
        <Footer />
      </div>
    </div>
  )
}
