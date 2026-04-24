import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from './Icons'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
      aria-label="Toggle theme"
    >
      {dark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </button>
  )
}
