import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, query, orderByChild, equalTo, get } from 'firebase/database'
import { db } from '../firebase'
import { decrypt, hash, hashRaw } from '../utils/crypto'
import { toTitleCase, toCapitalized } from '../utils/format'
import { SearchIcon, CheckCircleIcon, ExclamationIcon, PhoneIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/Icons'
import ThemeToggle from '../components/ThemeToggle'
import ShareButton from '../components/ShareButton'
import Footer from '../components/Footer'

const TYPE_LABELS = {
  educational: 'Educational',
  id:          'ID Document',
  financial:   'Financial',
  other:       'Other',
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [claimed, setClaimed] = useState(false)
  const [claimerPhone, setClaimerPhone] = useState('')

  const search = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const [snap1, snap2] = await Promise.all([
        get(query(ref(db, 'documents'), orderByChild('uniqueNumberHash'), equalTo(hash(input.trim())))),
        get(query(ref(db, 'documents'), orderByChild('uniqueNumberHash'), equalTo(hashRaw(input.trim())))),
      ])

      const merged = new Map()
      ;[snap1, snap2].forEach(snap => {
        if (snap.exists()) Object.entries(snap.val()).forEach(([id, val]) => merged.set(id, val))
      })

      if (merged.size > 0) {
        const docs = [...merged.entries()]
          .map(([id, val]) => ({
            id, ...val,
            type:          decrypt(val.type),
            firstName:     toTitleCase(decrypt(val.firstName)),
            lastName:      toTitleCase(decrypt(val.lastName)),
            finderPhone:   decrypt(val.finderPhone),
            foundLocation: toCapitalized(decrypt(val.foundLocation)),
          }))
          .filter(d => d.status === 'available')
        setResult(docs.length > 0 ? docs[0] : 'not_found')
      } else {
        setResult('not_found')
      }
    } catch {
      setError('تلاش نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">مخلص</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">اپنا کھویا ہوا کاغذ تلاش کریں</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex gap-2 mb-1">
            <input
              autoFocus
              value={input}
              onChange={e => { setInput(e.target.value); setResult(null); setError(null) }}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Registration / ID number"
              className="flex-1 border border-gray-200 dark:border-gray-600 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl px-4 py-3 text-base outline-none bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
            />
            <button
              onClick={search}
              disabled={loading || !input.trim()}
              className="bg-slate-800 dark:bg-slate-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white px-4 rounded-xl transition-all flex items-center justify-center"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">e.g. 12345-2020 · 42101-1234567-1</p>

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-500 dark:text-red-400">
              <ExclamationIcon className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {result === 'not_found' && (
            <div className="text-center pt-6 pb-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                <SearchIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">ابھی تک نہیں ملا</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No one has reported this document yet.</p>
              <button onClick={() => navigate('/login')} className="mt-4 flex items-center gap-1 mx-auto text-slate-500 dark:text-slate-400 text-xs underline underline-offset-2">
                Report it here <ArrowRightIcon />
              </button>
            </div>
          )}

          {result && result !== 'not_found' && !claimed && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> مل گیا
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{TYPE_LABELS[result.type] || result.type}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-4">
                {result.firstName && <p><span className="text-gray-400 dark:text-gray-500">Name:</span> {result.firstName} {result.lastName}</p>}
                <p><span className="text-gray-400 dark:text-gray-500">Location:</span> {result.foundLocation}</p>
                <p><span className="text-gray-400 dark:text-gray-500">Date:</span> {new Date(result.foundDate).toLocaleDateString()}</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Enter your phone to get finder's contact:</p>
              <input
                type="tel"
                value={claimerPhone}
                onChange={e => setClaimerPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="w-full border border-gray-200 dark:border-gray-600 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl px-4 py-3 outline-none bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors mb-3 text-sm"
              />
              <button
                onClick={() => claimerPhone.trim().length >= 10 && setClaimed(true)}
                disabled={claimerPhone.trim().length < 10}
                className="w-full bg-slate-800 dark:bg-slate-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                Claim My Document
              </button>
            </div>
          )}

          {claimed && result && result !== 'not_found' && (
            <div className="mt-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-1">Finder ka number:</p>
              <div className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-lg font-bold text-slate-800 dark:text-slate-100 border border-gray-200 dark:border-gray-600 mb-3">
                <PhoneIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                {result.finderPhone}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Public jagah milen — please</p>
              <button onClick={() => navigate('/')} className="mt-4 w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl font-semibold text-sm">
                Done
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-1.5 mt-5 text-slate-400 dark:text-slate-600 text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          <ArrowLeftIcon /> Back
        </button>
        <Footer />
      </div>
    </div>
  )
}
