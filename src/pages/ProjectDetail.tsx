import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState<any | null>(null)

  async function load() {
    if (!id) return
    const { data } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
    if (data) setProject(data)
  }

  useEffect(() => {
    load()
  }, [id])

  if (!project) return (
    <div className="min-h-screen bg-[#0e1514] text-white flex items-center justify-center">Loading...</div>
  )

  return (
    <div className="min-h-screen bg-[#0e1514] text-white p-8 max-w-4xl mx-auto">
      <Link to="/" className="text-sm text-gray-300 hover:text-[#59de9b]">← Back</Link>
      <h1 className="text-4xl font-bold text-[#59de9b] mt-6">{project.title}</h1>
      {project.image_url && <img src={project.image_url} alt={project.title} className="w-full h-80 object-cover rounded-lg mt-6" />}
      <p className="text-gray-300 mt-6">{project.description || 'No description provided.'}</p>
      <div className="mt-6 text-sm text-gray-400">Category: {project.category}</div>
      <div className="mt-2 text-sm text-gray-400">Status: {project.status}</div>
      {project.link && (
        <div className="mt-6">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#59de9b] text-black py-3 px-6 font-bold rounded-lg hover:scale-105 transition">
            View Live Project
          </a>
        </div>
      )}
    </div>
  )
}
