import  { useEffect, useState } from 'react'
import type { Project } from '../types'
import { Loader2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/configs/axios'

const Community = () => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const navigate = useNavigate();
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const projects = await api.get('/api/published');
      console.log(projects.data);
      setProjects(projects.data);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10 min-h-[calc(100vh-72px)] h-full">

      {/* ✅ Header always visible */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-2xl font-medium text-white">
          Community Projects
        </h1>
      </div>

      {/* ✅ Content below changes */}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2Icon className="animate-spin size-10 text-indigo-200" />
        </div>
      ) : (

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative rounded-xl bg-white/10 backdrop-blur-md
                 border border-white/10 p-5 text-white
                 shadow-lg hover:shadow-xl transition-all
                 cursor-context-menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  {project.name}
                </h2>
                <span className="text-xs text-white/60">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Preview */}
              {project.current_code ? (
                <iframe
                  src={project.current_code}
                  title={`${project.name} preview`}
                  className="w-full h-40 rounded-md border border-white/10 mb-4
                     pointer-events-none"   // ✅ REQUIRED
                />
              ) : (
                <div className="h-40 flex items-center justify-center
                        text-white/40 border border-dashed
                        border-white/20 rounded-md mb-4">
                  No preview available
                </div>
              )}

              {/* Prompt */}
              <p className="text-sm text-white/70 mb-4 line-clamp-3">
                {project.initial_prompt}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                  onClick={() => navigate(`/preview/${project.id}`)}
                >
                  Preview
                </button>
                <div
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  {project.user?.fullName}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
      }
    </div >
  )
}

export default Community
