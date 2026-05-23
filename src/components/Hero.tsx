import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  profile?: any
  avatarSrc: string
}

function useTyping(words: string[], speed = 90, pause = 1200) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [blink, setBlink] = useState(true)
  const [reverse, setReverse] = useState(false)

  useEffect(() => {
    if (index === words.length) return
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, reverse ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, words, speed])

  useEffect(() => {
    if (!reverse && subIndex === words[index].length + 1) {
      setReverse(true)
      const t = setTimeout(() => {}, pause)
      return () => clearTimeout(t)
    }

    if (reverse && subIndex === 0) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % words.length)
    }
  }, [subIndex, reverse, index, words, pause])

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 500)
    return () => clearInterval(id)
  }, [])

  return { text: words[index].slice(0, Math.max(0, subIndex)), caret: blink }
}

export default function Hero({ profile, avatarSrc }: Props) {
  const roles = profile?.roles ?? ['Full-Stack Developer', 'UI/UX Engineer', 'Supabase Dev']
  const { text, caret } = useTyping(roles as string[])

  return (
    <section className="pt-40 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <p className="uppercase tracking-[0.3em] text-[var(--neon)] text-sm mb-4">SUBJECT_IDENTITY_PROTOCOL</p>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          ARCHITECTING <span className="text-[var(--primary)]">DIGITAL</span> DIMENSIONS
        </h1>

        <div className="glass-panel p-6 rounded-xl max-w-2xl">
          <p className="text-[var(--text-secondary)] leading-relaxed">{profile?.bio ?? 'A futuristic full stack portfolio powered by React, TypeScript, Tailwind, and Supabase.'}</p>
        </div>

        <div className="mt-6 flex gap-4">
          <motion.a whileHover={{ scale: 1.03 }} href="#projects" className="bg-[var(--primary)] text-black py-3 px-5 rounded-lg font-bold shadow-neon">View Projects</motion.a>
          <motion.a whileHover={{ scale: 1.03 }} href="#contact" className="border border-[rgba(61,255,181,0.08)] text-[var(--neon)] py-3 px-5 rounded-lg">Contact</motion.a>
        </div>

        <div className="mt-6 text-lg text-[var(--text-secondary)]">
          <span className="mr-2">{text}</span>
          <span className="inline-block w-1 bg-[var(--neon)]" style={{ opacity: caret ? 1 : 0 }}>&nbsp;</span>
        </div>
      </motion.div>

      <div className="flex justify-center relative">
        <motion.div className="w-[340px] h-[340px] rounded-full p-4" initial={{ scale: 0.96 }} animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ duration: 6, repeat: Infinity }}>
          <div className="relative">
            <div className="absolute -inset-2 rounded-full" style={{ boxShadow: '0 0 60px rgba(61,255,181,0.07)' }} />
            <div className="rounded-full overflow-hidden border border-[rgba(61,255,181,0.06)] p-1 bg-gradient-to-b from-[rgba(0,168,107,0.06)] to-transparent">
              <img src={profile?.avatar_url ?? avatarSrc} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <svg className="absolute -right-6 -bottom-6" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="g" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#3DFFB5" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#00A86B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="54" stroke="url(#g)" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
