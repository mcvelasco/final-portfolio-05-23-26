import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Project = {
  id?: number
  title: string
  category?: string
  status?: string
  link?: string
  image_url?: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('Draft')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [link, setLink] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  const [experiences, setExperiences] = useState<any[]>([])
  const [expTitle, setExpTitle] = useState('')
  const [expCompany, setExpCompany] = useState('')
  const [expYears, setExpYears] = useState('')

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setProjects(data)
    }
  }

  async function fetchProfile() {
    const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
    if (data) {
      // adapt to your profiles schema
      // try common field names
      // @ts-ignore
      setName(data.name || '')
      // @ts-ignore
      setBio(data.bio || '')
    }
  }

  async function fetchExperiences() {
    const { data: sessionData } = await supabase.auth.getSession()
    const owner = sessionData?.session?.user?.id
    if (!owner) {
      setExperiences([])
      return
    }
    const { data } = await supabase.from('experiences').select('*').eq('owner', owner).order('start_date', { ascending: false })
    if (data) setExperiences(data)
  }

  useEffect(() => {
    fetchProjects()
    fetchProfile()
    fetchExperiences()
  }, [])

  async function addProject() {
    if (!title) return alert('Title required')
    const { data: sessionData } = await supabase.auth.getSession()
    const owner = sessionData?.session?.user?.id
    let imageUrl = imagePreview
    
    // Upload image if a new file is selected
    if (imageFile) {
      const fileName = `projects/${owner}/${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile)
      if (uploadError) return alert('Image upload failed: ' + uploadError.message)
      const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(fileName)
      imageUrl = publicUrl.publicUrl
    }
    
    if (editingId) {
      const { error } = await supabase.from('projects').update({ title, category, status, link, image_url: imageUrl }).eq('id', editingId)
      if (error) return alert(error.message)
      setEditingId(null)
    } else {
      const { error } = await supabase.from('projects').insert([{ owner, title, category, status, link, image_url: imageUrl }])
      if (error) return alert(error.message)
    }
    setTitle('')
    setCategory('')
    setStatus('Draft')
    setLink('')
    setImageFile(null)
    setImagePreview('')
    fetchProjects()
  }

  async function deleteProject(id?: number) {
    if (!id) return
    if (!confirm('Delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return alert(error.message)
    fetchProjects()
  }

  function editProject(p: Project & { id?: number }) {
    setEditingId(p.id || null)
    setTitle(p.title)
    setCategory(p.category || '')
    setStatus(p.status || 'Draft')
    // @ts-ignore
    setLink(p.link || '')
    setImagePreview(p.image_url || '')
    setImageFile(null)
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function updateProfile() {
    // Use authenticated user's id as `owner` instead of forcing `id`.
    const { data: sessionData } = await supabase.auth.getSession()
    const owner = sessionData?.session?.user?.id
    if (!owner) return alert('You must be signed in to update the profile')

    // Check if a profile already exists for this owner
    const { data: existing } = await supabase.from('profiles').select('id').eq('owner', owner).maybeSingle()

    if (existing && existing.id) {
      const { error } = await supabase.from('profiles').update({ name, bio, updated_at: new Date() }).eq('owner', owner)
      if (error) return alert(error.message)
      alert('Profile updated')
    } else {
      const { error } = await supabase.from('profiles').insert([{ owner, name, bio }])
      if (error) return alert(error.message)
      alert('Profile created')
    }
  }

  async function addExperience() {
    if (!expTitle) return alert('Experience title required')
    const { data: sessionData } = await supabase.auth.getSession()
    const owner = sessionData?.session?.user?.id
    if (!owner) return alert('You must be signed in to add an experience')
    const { error } = await supabase.from('experiences').insert([{ owner, title: expTitle, company: expCompany, years: expYears }])
    if (error) return alert(error.message)
    setExpTitle('')
    setExpCompany('')
    setExpYears('')
    fetchExperiences()
  }

  return (
    <div className="min-h-screen bg-[#0e1514] text-white p-8">
      <Link to="/" className="text-sm text-gray-300 hover:text-[#59de9b] transition mb-6 inline-block">← Back to Home</Link>
      <h1 className="text-5xl font-black text-[#59de9b] mb-10">CONTROL_CENTER</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-xl">
          <p>Total Projects</p>
          <h2 className="text-5xl font-bold mt-4">{projects.length}</h2>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <p>Profile</p>
          <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button onClick={updateProfile} className="mt-3 bg-[#59de9b] text-black py-2 px-4 rounded">Save Profile</button>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <p>Add Project</p>
          <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Project Link (URL)" value={link} onChange={(e) => setLink(e.target.value)} />
          <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" type="file" accept="image/*" onChange={handleImageSelect} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-full mt-2 rounded max-h-48 object-cover" />}
          <select className="w-full mt-2 p-2 rounded bg-[#0b1413]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Draft</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
          <button onClick={addProject} className="mt-3 bg-[#59de9b] text-black py-2 px-4 rounded">Add</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.id} className="border-b py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{p.title}</div>
                    <div className="text-sm text-gray-300">{p.category} — {p.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editProject(p as any)} className="text-sm bg-[#0b1413] px-3 py-1 rounded">Edit</button>
                    <button onClick={() => deleteProject(p.id)} className="text-sm bg-red-600 px-3 py-1 rounded">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Experiences</h2>

          <div className="mb-4">
            <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Title" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
            <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Company" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} />
            <input className="w-full mt-2 p-2 rounded bg-[#0b1413]" placeholder="Years" value={expYears} onChange={(e) => setExpYears(e.target.value)} />
            <button onClick={addExperience} className="mt-3 bg-[#59de9b] text-black py-2 px-4 rounded">Add Experience</button>
          </div>

          <ul>
            {experiences.map((ex: any, idx: number) => (
              <li key={idx} className="border-b py-3">
                <div className="font-bold">{ex.title}</div>
                <div className="text-sm text-gray-300">{ex.company} — {ex.years}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}