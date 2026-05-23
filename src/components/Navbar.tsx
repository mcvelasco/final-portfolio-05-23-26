import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import logoImg from '../assets/NA-logo.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function check() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setIsLoggedIn(!!data.session)
    }
    check()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="fixed top-0 w-full z-50 bg-[#0e1514]/80 backdrop-blur-xl border-b border-[#59de9b]/20"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <img src={logoImg} alt="NEON_ARCHIVE" className="h-10 w-auto" />

        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
          <Link to="/" className="text-[#87ffc6]">Home</Link>
          <a href="/#projects" className="text-gray-400 hover:text-[#59de9b]">Projects</a>
          <a href="/#experience" className="text-gray-400 hover:text-[#59de9b]">Experience</a>
          <Link to="/contact" className="text-gray-400 hover:text-[#59de9b]">Contact</Link>
          {!isLoggedIn ? (
            <Link to="/login" className="text-gray-400 hover:text-[#59de9b]">Login</Link>
          ) : (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                navigate('/')
              }}
              className="text-gray-400 hover:text-[#59de9b]"
            >
              Logout
            </button>
          )}
          <Link to="/admin" className="text-gray-400 hover:text-[#59de9b]">Admin</Link>
        </nav>

        <button
          className="md:hidden p-2 text-[#87ffc6]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0e1514] border-t border-[#59de9b]/10">
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)} className="text-[#87ffc6]">Home</Link>
            <a href="/#projects" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#59de9b]">Projects</a>
            <a href="/#experience" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#59de9b]">Experience</a>
            <Link to="/contact" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#59de9b]">Contact</Link>
            {!isLoggedIn ? (
              <Link to="/login" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#59de9b]">Login</Link>
            ) : (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  setOpen(false)
                  navigate('/')
                }}
                className="text-gray-400 hover:text-[#59de9b] text-left"
              >
                Logout
              </button>
            )}
            <Link to="/admin" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#59de9b]">Admin</Link>
          </div>
        </div>
      )}
    </motion.header>
  )
}