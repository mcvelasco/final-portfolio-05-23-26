import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e1514] text-white flex items-center justify-center px-6">
      <div className="glass-panel p-10 rounded-3xl text-center max-w-xl">
        <h1 className="text-5xl font-black text-[#59de9b] mb-6">404</h1>
        <p className="text-gray-300 mb-8">
          The page you are looking for does not exist. Please return to the homepage.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#59de9b] text-black py-4 px-8 rounded-full font-bold"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
