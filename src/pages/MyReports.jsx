import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, query, orderByChild, equalTo, get } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { decrypt } from '../utils/crypto'
import { toTitleCase, toCapitalized } from '../utils/format'
import ThemeToggle from '../components/ThemeToggle'
import ShareButton from '../components/ShareButton'
import { InboxIcon, PlusIcon, ArrowLeftIcon, CheckCircleIcon, DocumentIcon, MapPinIcon } from '../components/Icons'
import Footer from '../components/Footer'

const STATUS_STYLE = {
  available: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  claimed:   'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
  expired:   'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600',
}

const STATUS_LABEL = { available: 'Active', claimed: 'Claimed', expired: 'Expired' }

function decryptDoc(id, val) {
  return {
    id,
    status:        val.status,
    foundDate:     val.foundDate,
    expiresAt:     val.expiresAt,
    type:          decrypt(val.type),
    firstName:     toTitleCase(decrypt(val.firstName)),
    lastName:      toTitleCase(decrypt(val.lastName)),
    foundLocation: toCapitalized(decrypt(val.foundLocation)),
  }
}

export default function MyReports() {
  const navigate = useNavigate()
  const user = useAuth()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(ref(db, 'documents'), orderByChild('reportedBy'), equalTo(user.uid))
    get(q)
      .then(snap => {
        if (snap.exists()) {
          const list = Object.entries(snap.val())
            .map(([id, val]) => decryptDoc(id, val))
            .sort((a, b) => b.foundDate - a.foundDate)
          setDocs(list)
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  const counts = {
    available: docs.filter(d => d.status === 'available').length,
    claimed:   docs.filter(d => d.status === 'claimed').length,
    expired:   docs.filter(d => d.status === 'expired').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center px-4 py-8 transition-colors">
      <div className="w-full max-w-sm">

        <div className="flex justify-between items-center mb-2">
          <ShareButton />
          <ThemeToggle />
        </div>

        <div className="text-center mb-8">
          <img src="/logo/logo.png" alt="Mukhlis" className="w-14 h-14 mx-auto mb-3 rounded-2xl shadow-sm" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">میری رپورٹس</h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">My Reported Documents</p>
        </div>

        {!loading && docs.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { label: 'Active',  count: counts.available, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Claimed', count: counts.claimed,   color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Expired', count: counts.expired,   color: 'text-gray-400 dark:text-gray-500' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center shadow-sm">
                <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-600 text-sm">Loading...</div>
        )}

        {!loading && docs.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <InboxIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Abhi koi report nahi</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Koi document mila ho toh report karein</p>
            <button onClick={() => navigate('/report')} className="mt-5 w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl text-sm font-semibold">
              Report Karein
            </button>
          </div>
        )}

        {!loading && docs.length > 0 && (
          <div className="space-y-3">
            {docs.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[doc.status] || STATUS_STYLE.expired}`}>
                    {doc.status === 'claimed' && <CheckCircleIcon className="w-3 h-3" />}
                    {STATUS_LABEL[doc.status] || doc.status}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(doc.foundDate).toLocaleDateString('en-PK')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {doc.firstName && (
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <DocumentIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                      {doc.firstName} {doc.lastName}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                    {doc.foundLocation}
                  </div>
                </div>
                {doc.status === 'available' && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    Expires: {new Date(doc.expiresAt).toLocaleDateString('en-PK')}
                  </p>
                )}
              </div>
            ))}

            <button onClick={() => navigate('/report')} className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <PlusIcon /> نئی Report کریں
            </button>
          </div>
        )}

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-1.5 mt-5 text-slate-400 dark:text-slate-600 text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          <ArrowLeftIcon /> Back
        </button>
        <Footer />
      </div>
    </div>
  )
}
