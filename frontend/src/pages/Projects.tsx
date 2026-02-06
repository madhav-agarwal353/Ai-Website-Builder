import React, { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { useState } from 'react';
import { Download, EyeClosed, EyeOffIcon, FullscreenIcon, Laptop, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletSmartphoneIcon, XIcon } from 'lucide-react';
import image from '../../public/favicon.png'
import Sidebar from '../components/Sidebar';
import { type ProjectPreviewRef, ProjectPreview } from '../components/ProjectPreview';
import Loader from '../components/Loader'
import { api } from "@/configs/axios";
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';


const Projects = () => {
  const [publish, setPublish] = useState("disabled");
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [project, setproject] = useState<Project | null>(null)
  const [loading, setloading] = useState(true)
  const [isGenerate, setisGenerate] = useState(false)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")
  const [isSaving, setisSaving] = useState(false)
  const [isMenuOpen, setisMenuOpen] = useState(true)
  const previewRef = useRef<ProjectPreviewRef>(null)

  const fetchProjects = async () => {
    try {
      setloading(false);
      const { data } = await api.get(`api/user/project/${projectId}`)
      console.log(data);
      setproject(data.project);
      setisGenerate(data.project.current_code ? false : true);
      setPublish(data.project.isPublished ? "published" : "unpublished");
    }
    catch (err: any) {
      console.log(err)
      toast.error("Failed to fetch project")
    }
  }
  const saveProject = async () => {
    try {
      setisSaving(true);
      await api.put(`/api/save/${projectId}`);
      setisSaving(false);
      toast.success("Project saved successfully")
    }
    catch (err) {
      console.error("Error saving project:", err);
      toast.error("Failed to save project")
    }
  }
  const downloadCode = async () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) {
      if (isGenerate)
        return
      return
    }
    const element = document.createElement('a');
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html"
    document.body.appendChild(element);
    element.click();
  }
  const togglePublish = async () => {
    try {
      const { data } = await api.put(`/api/published/${projectId}`);
      setPublish(prev => prev === "published" ? "unpublished" : "published");
      toast.success(`Project ${data.message}`)
    }
    catch (err) {
      console.error("Error toggling publish status:", err);
      toast.error(`Failed to toggle project publish status`)
    }
  }
  useEffect(() => {
    if (session?.user) {
      fetchProjects();
    }
    else if (!isPending && !session?.user) {
      navigate("/");
      toast.info("Please Log in")
    }
  }, [session, isPending])
  useEffect(() => {
    if (project && !project.current_code) {
      const interval = setInterval(() => {
        fetchProjects();
      }, 10000)
      return () => clearInterval(interval);
    }
  }, [project])

  return (
    <div className='h-screen overflow-hidden'>
      {loading ? (
        <div className='h-screen w-full flex justify-center items-center'>
          <Loader2Icon className="animate-spin size-10" />
        </div>
      ) : (
        project ? (
          <div className="flex flex-col w-full text-white">
            <div className="flex flex-row items-center w-full px-4 py-4 gap-4 h-20">

              {/* Left: Logo + Project Info */}
              <div className="flex items-center gap-2 min-w-0">
                <img src={image} alt="fav-icon" className="h-10 shrink-0" />
                <div className="max-w-xs flex flex-col overflow-hidden">
                  <p className="text-xl font-medium capitalize truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-400 -mt-0.5">
                    Previewing last saved version
                  </p>
                </div>
              </div>

              {/* Center: Device Switcher */}
              <div className="flex items-center gap-2 bg-gray-800 rounded-2xl p-2 px-4 ">
                <SmartphoneIcon
                  onClick={() => setDevice("phone")}
                  className={`size-6 p-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""
                    }`}
                />
                <TabletSmartphoneIcon
                  onClick={() => setDevice("tablet")}
                  className={`size-6 p-1 rounded cursor-pointer ${device === "tablet" ? "bg-gray-700" : ""
                    }`}
                />
                <Laptop
                  onClick={() => setDevice("desktop")}
                  className={`size-6 p-1 rounded cursor-pointer ${device === "desktop" ? "bg-gray-700" : ""
                    }`}
                />
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 ml-auto text-xs sm:text-sm">

                <button
                  onClick={saveProject}
                  disabled={isSaving}
                  className="
    flex items-center gap-2 px-3 py-1.5
    rounded-lg
    bg-gray-800 hover:bg-gray-700
    text-sm font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  "
                >
                  {isSaving ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <SaveIcon className="size-4" />
                  )}
                  Save
                </button>

                <Link
                  target="_blank"
                  to={`/preview/${projectId}`}
                  className="
    flex items-center gap-2 px-3 py-1.5
    rounded-lg
    bg-gray-800 hover:bg-gray-700
    text-sm font-medium
    transition-all duration-200
  "
                >
                  <FullscreenIcon className="size-4" />
                  Preview
                </Link>

                <button
                  className="
    flex items-center gap-2 px-3 py-1.5
    rounded-lg
    bg-gray-800 hover:bg-gray-700
    text-sm font-medium
    transition-all duration-200
  " onClick={downloadCode}
                >
                  <Download className="size-4" />
                  Download
                </button>

                <button
                  className={`
    flex items-center gap-2 px-3 py-1.5
    rounded-lg
    ${publish === "published" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-800 hover:bg-gray-700"}
    ${publish === "disabled" ? "cursor-not-allowed opacity-50 disabled" : ""}
    text-sm font-medium
    transition-all duration-200 
  `}
                  onClick={togglePublish}
                >
                  {publish === "published" ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeClosed className="size-4" />
                  )}
                  {publish === "published" ? "Unpublish" : "Publish"}
                </button>


                {/* Mobile Menu */}
                <div className="sm:hidden ml-2">
                  {isMenuOpen ? (
                    <XIcon
                      onClick={() => setisMenuOpen(false)}
                      className="size-6 cursor-pointer"
                    />
                  ) : (
                    <MessageSquareIcon
                      onClick={() => setisMenuOpen(true)}
                      className="size-6 cursor-pointer"
                    />
                  )}
                </div>

              </div>
            </div>
            <div className='flex-1 flex'>
              <Sidebar
                isMenuOpen={isMenuOpen} project={project}
                setProject={(p) => setproject(p)} isGenerate={isGenerate}
                setisGenerate={(p) => setisGenerate(p)}
              />
              {isGenerate ? (
                <Loader />
              ) : (
                < div className='flex-1 h-full'>
                  <ProjectPreview ref={previewRef} project={project}
                    isGenerate={isGenerate} device={device}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className='flex items-center justify-center h-[calc(100vh-72px)]'>
            <p>Unable to load project!!</p>
          </div>
        )
      )}
    </div >
  );
}
export default Projects