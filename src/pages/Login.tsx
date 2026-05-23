import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1514]">
      <div className="glass-panel p-10 w-full max-w-md rounded-xl">
        <h1 className="text-3xl font-bold text-[#59de9b] mb-8">
          ADMIN_LOGIN
        </h1>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-[#59de9b]/20 p-4 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-[#59de9b]/20 p-4 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full bg-[#59de9b] text-black py-4 font-bold rounded"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  )
}