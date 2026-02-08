import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { useState } from 'react';
import {
  Download,
  EyeClosed,
  EyeOffIcon,
  FullscreenIcon,
  Laptop,
  Loader2Icon,
  MessageSquareIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletSmartphoneIcon,
  XIcon,
} from 'lucide-react';
import image from '../../public/favicon.png'
import Sidebar from '../components/Sidebar';
import { type ProjectPreviewRef, ProjectPreview } from '../components/ProjectPreview';
import Loader from '../components/Loader'
import { api } from "@/configs/axios";
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const Projects = () => {
  const [publish, setPublish] = useState("disabled");
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [project, setproject] = useState<Project | null>(null)
  const [loading, setloading] = useState(false)

  // split generation states
  const [isInitialGenerating, setIsInitialGenerating] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)

  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")
  const [isSaving, setisSaving] = useState(false)
  const [isMenuOpen, setisMenuOpen] = useState(true)
  const [isgenerating, setisgenerating] = useState(false)
  const previewRef = useRef<ProjectPreviewRef>(null)

  // hold interval id so we can clear it on unmount / replace it safely
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchProjects = async ({ silent = false } = {}) => {
    const isFirstLoad = project === null

    try {
      if (isFirstLoad && !silent) {
        setloading(true)
      }
      setisgenerating(true);
      const { data } = await api.get(`/api/user/project/${projectId}`)
      if (project)
        setisgenerating(data.project.current_code ? false : true) // if no current code, we must be generating the first version
      setproject(data.project)
    } finally {
      if (isFirstLoad && !silent) {
        setloading(false)
      }
    }
  }


  // generateCode: parent owns generation + polling
  const generateCode = async (message: string) => {
    if (!project) return;
    if (isInitialGenerating || isUpgrading) {
      // already generating — ignore extra calls
      return;
    }
    setisgenerating(true);
    // determine whether this is the first generation (no current_code) or an upgrade
    const isFirstGeneration = !project.current_code;
    if (isFirstGeneration) setIsInitialGenerating(true);
    else setIsUpgrading(true);

    const previousVersionCount = project.versions.length;
    let attempts = 0;

    try {
      await api.post(`/api/changes/${project.id}`, { message });

      // clear any existing interval (safety)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      intervalRef.current = setInterval(async () => {
        try {
          attempts++;

          const { data } = await api.get(`/api/user/project/${project.id}`);
          const updatedProject = data.project;

          // stop only when a NEW version is present
          if (updatedProject.versions.length > previousVersionCount) {
            setproject(updatedProject);
            setIsInitialGenerating(false);
            setIsUpgrading(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }

          if (attempts >= 50) { // timeout
            toast.error('Code generation is taking too long')
            setIsInitialGenerating(false)
            setIsUpgrading(false)
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        } catch (err) {
          console.error(err)
          toast.error('Failed to check generation status')
          setIsInitialGenerating(false)
          setIsUpgrading(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 10000);
    } catch (err: any) {
      console.error('Error generating response:', err)
      toast.error(err?.response?.data?.error || 'Failed to generate response')
      setIsInitialGenerating(false)
      setIsUpgrading(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    finally {
      setisgenerating(false);
    }
  }

  // rollback: parent owns API call and updating project
  const rollbackToVersion = async (versionId: string) => {
    setloading(true)
    if (!project) return;
    try {
      const confirmRollback = window.confirm('Are you sure you want to rollback to this version? This action cannot be undone.');
      if (!confirmRollback) return;

      await api.post(`/api/rollback/${project.id}/${versionId}`);

      // refresh the project (you can optimize by using the response from rollback if it returns project)
      const { data } = await api.get(`/api/user/project/${project.id}`);
      setproject(data.project);
      setIsInitialGenerating(false);
      setIsUpgrading(false);
      toast.success('Rollback successful');
    } catch (err) {
      console.error('Error rolling back version:', err);
      toast.error('Failed to rollback version');
    }
    finally {
      setloading(false);
    }
  }

  const saveProject = async () => {
    if (!projectId) return;
    try {
      setisSaving(true);
      await api.put(`/api/save/${projectId}`,
        {
          code: project?.current_code
        }
      );
      setisSaving(false);
      toast.success("Project saved successfully")
    }
    catch (err) {
      console.error("Error saving project:", err);
      setisSaving(false);
      toast.error("Failed to save project")
    }
  }

  const downloadCode = async () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) {
      if (isInitialGenerating || isUpgrading) return;
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html"
    document.body.appendChild(element);
    element.click();
  }

  const togglePublish = async () => {
    if (!projectId) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isPending])

  // cleanup on unmount: clear any polling interval
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [])

  const isBusy = isInitialGenerating || isUpgrading;

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
                isMenuOpen={isMenuOpen}
                project={project}
                isBusy={isgenerating}
                onGenerate={generateCode}
                onRollback={rollbackToVersion}
              />
              {isgenerating ? (
                <Loader />
              ) : (
                <div className='flex-1 h-full'>
                  <ProjectPreview
                    ref={previewRef}
                    project={project}
                    isGenerate={isgenerating} // show upgrade state if you want streaming indicator inside preview
                    device={device}
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