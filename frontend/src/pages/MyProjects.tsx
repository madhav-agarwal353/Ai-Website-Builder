import React, { useEffect, useState } from 'react'
import type { Project } from '../types'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MyProjects = () => {
    const [loading, setLoading] = useState(false)
    const [contextMenu, setContextMenu] = useState<{
        x: number
        y: number
        projectId: string
    } | null>(null)
    const deleteProjectHandler = (id: string) => {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        setContextMenu(null);
        console.log("Deleted project:", id);
    };
    const [projects, setProjects] = useState<Project[]>([{
        id: '1',
        name: 'AI Portfolio Website',
        initial_prompt: 'Create a modern portfolio website with AI-themed design and animations.',
        current_code: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        createdAt: '2025-01-10T12:30:00Z',
        updatedAt: '2025-01-12T14:00:00Z',
        userId: 'user_123',

        conversation: [],
        versions: [],
        current_version_index: '0',
    },
    {
        id: '2',
        name: 'SaaS Landing Page',
        initial_prompt: 'Build a SaaS landing page with pricing, testimonials, and CTA.',
        current_code: '',
        createdAt: '2025-01-05T09:15:00Z',
        updatedAt: '2025-01-05T09:15:00Z',
        userId: 'user_123',

        conversation: [],
        versions: [],
        current_version_index: '0',
    },])
    const navigate = useNavigate();
    const fetchProjects = async () => {
        try {
            setLoading(true)
            // fetch projects here
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
                    My Projects
                </h1>

                <button
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg
                     bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500
                     text-white font-medium
                     hover:opacity-90 active:scale-95 transition-all"
                    onClick={() => { navigate('/') }}
                >
                    <PlusIcon size={18} />
                    Create New Project
                </button>
            </div>

            {/* ✅ Content below changes */}
            {loading ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2Icon className="animate-spin size-10 text-indigo-200" />
                </div>
            ) : projects.length === 0 ? (
                <p className="text-white/60 text-center">
                    You don’t have any projects yet.
                </p>
            ) : (

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    onContextMenu={(e) => e.preventDefault()} // ⛔ disable browser menu in grid
                >
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setContextMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    projectId: project.id,
                                })
                            }}
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

                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-sm rounded-md
                             bg-white/10 hover:bg-white/20">
                                        Open
                                    </button>

                                    <button
                                        className="px-3 py-1 text-sm rounded-md
                       bg-gradient-to-r from-purple-500 to-indigo-500
                       hover:opacity-90"
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                    >
                                        Website
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Context Menu */}
                    {contextMenu && (
                        <>
                            {/* Click-away overlay */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setContextMenu(null)}
                            />

                            {/* Menu */}
                            <div
                                className="fixed z-50 w-40 rounded-lg bg-zinc-900
                   border border-white/10 shadow-xl
                   text-sm text-white"
                                style={{
                                    top: contextMenu.y,
                                    left: contextMenu.x,
                                }}
                            >
                                <button
                                    className="w-full text-left px-4 py-2
                     text-red-400 hover:bg-red-500/20"
                                    onClick={() => {
                                        deleteProjectHandler(contextMenu.projectId)
                                        setContextMenu(null)
                                    }}
                                >
                                    Delete Project
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyProjects
