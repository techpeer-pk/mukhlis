import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push } from 'firebase/database'
import { signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { encrypt, hash } from '../utils/crypto'
import { toTitleCase, toCapitalized } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/UserAvatar'
import ThemeToggle from '../components/ThemeToggle'
import ShareButton from '../components/ShareButton'
import { AcademicCapIcon, IdentificationIcon, CreditCardIcon, ClipboardIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '../components/Icons'
import Footer from '../components/Footer'

const DOC_TYPES = [
  { value: 'educational', label: 'Educational',  sub: 'Degree, transcript, student ID',  Icon: AcademicCapIcon },
  { value: 'id',          label: 'ID Document',  sub: 'CNIC, passport, driving license', Icon: IdentificationIcon },
  { value: 'financial',   label: 'Financial',    sub: 'ATM card, checkbook',             Icon: CreditCardIcon },
  { value: 'other',       label: 'Other',        sub: 'Bills, receipts, etc.',           Icon: ClipboardIcon },
]

const STEPS = ['Type', 'Number', 'Name', 'Contact', 'Location']

const inputCls = 'w-full border border-gray-200 dark:border-gray-600 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl px-4 py-3 outline-none bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors text-sm'

export default function ReportPage() {
  const navigate = useNavigate()
  const user = useAuth()
  const logout = () => signOut(auth).then(() => navigate('/'))
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ type:'', uniqueNumber:'', firstName:'', lastName:'', finderPhone:'', foundLocation:'' })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const canNext = () => {
    if (step === 1) return form.uniqueNumber.trim().length >= 3
    if (step === 2) return true
    if (step === 3) return form.finderPhone.trim().length >= 10
    if (step === 4) return form.foundLocation.trim().length >= 2
    return false
  }

  const submit = async () => {
    setLoading(true)
    try {
      await push(ref(db, 'documents'), {
        uniqueNumberHash: hash(form.uniqueNumber),
        type:             encrypt(form.type),
        firstName:        encrypt(toTitleCase(form.firstName)),
        lastName:         encrypt(toTitleCase(form.lastName)),
        finderPhone:      encrypt(form.finderPhone.trim()),
        foundLocation:    encrypt(toCapitalized(form.foundLocation)),
        status:           'available',
        reportedBy:       user.uid,
        foundDate:        Date.now(),
        createdAt:        Date.now(),
        expiresAt:        Date.now() + 90 * 24 * 60 * 60 * 1000,
      })
      setStep(5)
    } catch (e) {
      alert('خطا: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 transition-colors">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">رپورٹ ہو گئی</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Document listed. Owner will find it when they search.</p>
            <button onClick={() => navigate('/my-reports')} className="w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl font-semibold text-sm mb-2">
              My Reports دیکھیں
            </button>
            <button
              onClick={() => { setStep(0); setForm({ type:'', uniqueNumber:'', firstName:'', lastName:'', finderPhone:'', foundLocation:'' }) }}
              className="w-full border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ایک اور Report کریں
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm">

        <div className="flex justify-between items-center mb-2">
          <ShareButton />
          <ThemeToggle />
        </div>

        <div className="text-center mb-8">
          <img src="/logo/logo.png" alt="Mukhlis" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-sm" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">کاغذ رپورٹ کریں</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Report a Found Document</p>
          {user && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <UserAvatar user={user} />
              <span className="text-xs text-slate-400 dark:text-slate-500 max-w-[120px] truncate">{user.displayName || user.email}</span>
              <button onClick={() => navigate('/my-reports')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors ml-1">My Reports</button>
              <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
              <button onClick={logout} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Logout</button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-slate-700 dark:bg-slate-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Document ka type select karein:</p>
              {DOC_TYPES.map(({ value, label, sub, Icon }) => (
                <button
                  key={value}
                  onClick={() => { set('type', value); setStep(1) }}
                  className={`w-full flex items-center gap-3 text-left p-3.5 rounded-xl border transition-all ${form.type === value ? 'border-slate-700 dark:border-slate-400 bg-slate-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
                  <span>
                    <span className="block font-medium text-slate-800 dark:text-slate-200 text-sm">{label}</span>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Document par likha unique number:</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">e.g. 12345-2020, 42101-1234567-1</p>
              <input autoFocus value={form.uniqueNumber} onChange={e => set('uniqueNumber', e.target.value)} placeholder="Registration / ID number" className={inputCls} />
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Document par malik ka naam <span className="text-gray-300 dark:text-gray-600">(optional)</span></p>
              <div className="space-y-2 mt-3">
                <input autoFocus value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" className={inputCls} />
                <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last name" className={inputCls} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Aapka phone number:</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Sirf match hone par dikhaya jayega</p>
              <input autoFocus type="tel" value={form.finderPhone} onChange={e => set('finderPhone', e.target.value)} placeholder="03XX-XXXXXXX" className={inputCls} />
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Kahan mila tha?</p>
              <input autoFocus value={form.foundLocation} onChange={e => set('foundLocation', e.target.value)} placeholder="City (e.g. Karachi)" className={inputCls} />
            </div>
          )}

          {step !== 0 && (
            <button
              disabled={!canNext() || loading}
              onClick={step === 4 ? submit : () => setStep(s => s + 1)}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              {loading ? 'Submit ho raha hai...' : step === 4 ? 'Submit Report' : <><span>Next</span><ArrowRightIcon /></>}
            </button>
          )}
        </div>

        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')} className="w-full flex items-center justify-center gap-1.5 mt-5 text-slate-400 dark:text-slate-600 text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          <ArrowLeftIcon /> Back
        </button>
        <Footer />
      </div>
    </div>
  )
}
