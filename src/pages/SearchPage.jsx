import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, query, orderByChild, equalTo, get } from 'firebase/database'
import { db } from '../firebase'
import { decrypt, hash, hashRaw } from '../utils/crypto'
import { toTitleCase, toCapitalized } from '../utils/format'
import { useLanguage } from '../context/LanguageContext'
import { SearchIcon, CheckCircleIcon, ExclamationIcon, PhoneIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/Icons'
import ThemeToggle from '../components/ThemeToggle'
import LanguageToggle from '../components/LanguageToggle'
import ShareButton from '../components/ShareButton'
import Footer from '../components/Footer'

const TYPE_KEYS = {
  educational: 'type_educational',
  id:          'type_id',
  financial:   'type_financial',
  other:       'type_other',
}

export default function SearchPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
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
      setError(t('search_error'))
    } finally {
      setLoading(false)
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
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{t('search_subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex gap-2 mb-1">
            <input
              autoFocus
              value={input}
              onChange={e => { setInput(e.target.value); setResult(null); setError(null) }}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder={t('search_placeholder')}
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
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('search_hint')}</p>

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
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{t('not_found_title')}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('not_found_sub')}</p>
              <button onClick={() => navigate('/login')} className="mt-4 flex items-center gap-1 mx-auto text-slate-500 dark:text-slate-400 text-xs underline underline-offset-2">
                {t('report_it')} <ArrowRightIcon />
              </button>
            </div>
          )}

          {result && result !== 'not_found' && !claimed && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t('step1_label')}</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-gray-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{t('step2_label')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> {t('found_badge')}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{t(TYPE_KEYS[result.type]) || result.type}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-4">
                {result.firstName && <p><span className="text-gray-400 dark:text-gray-500">{t('label_name')}:</span> {result.firstName} {result.lastName}</p>}
                <p><span className="text-gray-400 dark:text-gray-500">{t('label_location')}:</span> {result.foundLocation}</p>
                <p><span className="text-gray-400 dark:text-gray-500">{t('label_date')}:</span> {new Date(result.foundDate).toLocaleDateString()}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-3">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{t('enter_phone_title')}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{t('enter_phone_sub')}</p>
              </div>
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
                {t('get_number_btn')}
              </button>
            </div>
          )}

          {claimed && result && result !== 'not_found' && (
            <div className="mt-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t('step1_label')}</span>
                </div>
                <div className="flex-1 h-px bg-emerald-300 dark:bg-emerald-700 max-w-[40px]" />
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t('step2_label')}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('finder_number_label')}</p>
              <p className="text-3xl font-bold tracking-wide text-slate-800 dark:text-slate-100 mb-4">{result.finderPhone}</p>
              <a
                href={`tel:${result.finderPhone}`}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all text-sm mb-2"
              >
                <PhoneIcon className="w-4 h-4" /> {t('call_now')}
              </a>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{t('public_place')}</p>
              <button onClick={() => navigate('/')} className="w-full border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 py-2.5 rounded-xl text-sm">
                {t('done')}
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-1.5 mt-5 text-slate-400 dark:text-slate-600 text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          <ArrowLeftIcon /> {t('back')}
        </button>
        <Footer />
      </div>
    </div>
  )
}
