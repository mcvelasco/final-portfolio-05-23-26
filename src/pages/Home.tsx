import Navbar from '../components/Navbar'
import profileImg from '../assets/profile.jpg'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [experiences, setExperiences] = useState<any[]>([])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
  }

  async function fetchProfile() {
    const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
    if (data) setProfile(data)
  }

  async function fetchExperiences() {
    const { data } = await supabase.from('experiences').select('*').order('created_at', { ascending: false })
    if (data) setExperiences(data)
  }

  useEffect(() => {
    fetchProjects()
    fetchProfile()
    fetchExperiences()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  }

  const card = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen hex-grid bg-[#0e1514] text-white">
      <Navbar />

      <Hero profile={profile} avatarSrc={profileImg} />

      <section id="projects" className="max-w-7xl mx-auto px-6 mt-20 mb-24">
        <h2 className="text-4xl font-extrabold text-[#59de9b] mb-6">Projects</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6">
          {projects.length === 0 && <div className="glass-panel p-6 rounded-xl">No projects yet</div>}
          {projects.map((p) => (
            <motion.div variants={card} key={p.id} whileHover={{ scale: 1.02 }} className="glass-panel p-6 rounded-xl overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover rounded mb-4" />}
              <Link to={`/projects/${p.id}`}>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <div className="text-sm text-gray-300">{p.category}</div>
                <div className="text-xs text-gray-500 mt-2">{p.status}</div>
              </Link>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs bg-[rgba(61,255,181,0.1)] text-[#3DFFB5] py-2 px-3 rounded hover:bg-[rgba(61,255,181,0.2)] transition">
                  View Live →
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="experience" className="max-w-7xl mx-auto px-6 mb-40">
        <h2 className="text-4xl font-extrabold text-[#59de9b] mb-6">Experience</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6">
          {experiences.length === 0 && <div className="glass-panel p-6 rounded-xl">No experiences yet</div>}
          {experiences.map((exp: any, idx: number) => (
            <motion.div variants={card} key={idx} className="glass-panel p-6 rounded-xl">
              <h3 className="font-bold text-lg text-[#59de9b] mb-2">{exp.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{exp.company}</p>
              <p className="text-xs text-gray-400">{exp.years}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}