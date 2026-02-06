import React, { useEffect, useRef, useState } from 'react'
import type { Message, Project, Version } from '../types'
import { BotIcon, EyeIcon, Loader2Icon, SendIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/configs/axios'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

interface SideBarProps {
    isMenuOpen: boolean
    project: Project
    setProject: (project: Project) => void
    isGenerate: boolean
    setisGenerate: (isGenerate: boolean) => void
}

const Sidebar = ({
    isMenuOpen,
    project,
    setProject,
    isGenerate,
    setisGenerate,
}: SideBarProps) => {
    const messageRef = useRef<HTMLDivElement>(null)
    const [input, setinput] = useState<string>('')
    const { data: session } = authClient.useSession();
    const handleRollback = async (versionId: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to rollback to this version? This action cannot be undone.')
            if (!confirm) return;
            const { data } = await api.post(`/api/rollback/${project.id}/${versionId}`)
            const { data: data2 } = await api.get(`/api/user/project/${project.id}`)
            toast.success('Rollback successful')
            console.log('Rollback successful:', data)
            setProject(data2.project)
            setisGenerate(false)
        } catch (error) {
            toast.error('Failed to rollback version')
            console.error('Error rolling back version:', error)
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return;

        const previousVersionCount = project.versions.length;
        let attempts = 0
        let interval: ReturnType<typeof setInterval> | null = null

        try {
            setisGenerate(true)

            await api.post(`/api/changes/${project.id}`, {
                message: input,
            })

            setinput('')

            interval = setInterval(async () => {
                try {
                    attempts++

                    const { data } = await api.get(`/api/user/project/${project.id}`)
                    const updatedProject = data.project

                    // ✅ ONLY stop when NEW CODE is created
                    const current_version_index = updatedProject.versions.length
                    if (current_version_index > previousVersionCount) {
                        setProject(updatedProject)
                        setisGenerate(false)
                        if (interval) {
                            clearInterval(interval)
                            interval = null
                        }
                        return
                    }
                    if (attempts >= 50) {
                        toast.error('Code generation is taking too long')
                        setisGenerate(false)

                        if (interval) {
                            clearInterval(interval)
                            interval = null
                        }
                    }
                } catch (err) {
                    console.error(err)
                    toast.error('Failed to check generation status')
                    setisGenerate(false)

                    if (interval) {
                        clearInterval(interval)
                        interval = null
                    }
                }
            }, 10000)
        } catch (error: any) {
            console.error('Error generating response:', error)
            toast.error(error?.response?.data?.error || 'Failed to generate response')
            setisGenerate(false)

            if (interval) {
                clearInterval(interval)
                interval = null
            }
        }
    }


    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [project.conversation.length, isGenerate])

    return (
        <div
            className={`h-[calc(100vh-80px)]
 sm:max-w-sm bg-gray-900 border border-gray-800 rounded-2xl shadow-xl transition-all duration-300 flex flex-col
      ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}
        >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar purpple-scrollbar px-4 py-4 flex flex-col gap-5">
                {[...project.conversation, ...project.versions]
                    .sort(
                        (a, b) =>
                            new Date(a.timestamp).getTime() -
                            new Date(b.timestamp).getTime(),
                    )
                    .map((message) => {
                        const isMessage = 'content' in message

                        if (isMessage) {
                            const msg = message as Message
                            const isUser = msg.role === 'user'

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    {!isUser && (
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center shadow-md">
                                            <BotIcon className="size-5 text-white" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-md
                                               ${isUser
                                                ? 'bg-gradient-to-br from-purple-800 to-fuchsia-900 text-gray-100 rounded-br-md'
                                                : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 rounded-bl-md'
                                            }`}

                                    >
                                        {msg.content}
                                    </div>

                                    {
                                        isUser && (
                                            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                                                <UserIcon className="size-5 text-gray-700" />
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        } else {
                            const ver = message as Version
                            const isCurrent = project.current_version_index == ver.id

                            return (
                                <div
                                    key={ver.id}
                                    className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex flex-col gap-2 shadow-sm"
                                >
                                    <div className="text-xs text-gray-400 flex justify-between">
                                        <span>Code updated</span>
                                        <span>{new Date(ver.timestamp).toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {isCurrent ? (
                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-400">
                                                Current Version
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleRollback(ver.id)}
                                                className="text-xs px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition"
                                            >
                                                Rollback
                                            </button>
                                        )}

                                        <Link
                                            target="_"
                                            to={`/preview/${project.id}/${ver.id}`}
                                            className="text-gray-400 hover:text-white transition"
                                        >
                                            <EyeIcon className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                    })}

                {isGenerate && (
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center shadow-md">
                            <BotIcon className="size-5 text-white" />
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
                        </div>
                    </div>
                )}

                <div ref={messageRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="relative">
                    <textarea
                        rows={3}
                        value={input}
                        disabled={isGenerate}
                        onChange={(e) => setinput(e.target.value)}
                        placeholder="Describe what you want to build..."
                        className="w-full resize-none rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 pr-12 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="absolute bottom-2 right-2 h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition disabled:opacity-50"
                        disabled={isGenerate}
                    >
                        {isGenerate ? (
                            <Loader2Icon className="size-5 animate-spin text-white" />
                        ) : (
                            <SendIcon className="size-5 text-white" />
                        )}
                    </button>
                </div>
            </form>
        </div >
    )
}

export default Sidebar
