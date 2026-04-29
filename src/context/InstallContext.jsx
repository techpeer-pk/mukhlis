import { createContext, useContext, useEffect, useState } from 'react'

const isIOSDevice = () => /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

const InstallContext = createContext(null)

export function InstallProvider({ children }) {
  const [prompt, setPrompt] = useState(null)
  const [ios, setIos] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (isInStandaloneMode()) { setInstalled(true); return }
    if (isIOSDevice()) { setIos(true); return }

    const handler = e => { e.preventDefault(); setPrompt(e) }
    const onInstalled = () => { setInstalled(true); setPrompt(null) }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const triggerInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') { setInstalled(true); setPrompt(null) }
  }

  return (
    <InstallContext.Provider value={{ prompt, ios, installed, triggerInstall }}>
      {children}
    </InstallContext.Provider>
  )
}

export const useInstall = () => useContext(InstallContext)
