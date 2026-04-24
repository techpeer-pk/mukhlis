import { useState } from 'react'

export default function UserAvatar({ user, size = 'sm' }) {
  const [imgError, setImgError] = useState(false)

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  const sizeClass = size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-8 h-8 text-sm'

  if (user?.photoURL && !imgError) {
    return (
      <img
        src={user.photoURL}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover`}
        alt=""
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-slate-200 text-slate-600 font-semibold flex items-center justify-center`}>
      {initials}
    </div>
  )
}
