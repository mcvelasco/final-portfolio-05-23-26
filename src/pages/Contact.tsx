import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function submit() {
    if (!email || !message) return alert('Email and message required')
    const { error } = await supabase.from('contacts').insert([{ name, email, message }])
    if (error) return alert(error.message)
    setName('')
    setEmail('')
    setMessage('')
    alert('Message sent')
  }

  return (
    <div className="min-h-screen bg-[#0e1514] text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#59de9b] mb-6">Contact</h1>
        <div className="glass-panel p-6 rounded-xl">
          <input className="w-full mt-2 p-3 rounded bg-[#0b1413]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full mt-2 p-3 rounded bg-[#0b1413]" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea className="w-full mt-2 p-3 rounded bg-[#0b1413]" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={submit} className="mt-3 bg-[#59de9b] text-black py-2 px-4 rounded">Send</button>
        </div>
      </main>
    </div>
  )
}
