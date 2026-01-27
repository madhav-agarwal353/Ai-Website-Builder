import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { useState } from 'react';
import { Loader2Icon } from 'lucide-react';

const DUMMY_PROJECTS: Project[] = [
  {
    id: "proj_1",
    name: "Lumina SaaS Landing",
    initial_prompt: "Create a high-end dark mode landing page for a cloud computing startup with purple glow effects.",
    current_code: "<!DOCTYPE html><html><head><script src='https://cdn.tailwindcss.com'></script></head><body class='bg-black text-white'>...</body></html>",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-21T12:30:00Z",
    userId: "user_01",
    isPublished: true,
    current_version_index: "1",
    versions: [
    ],
    conversation: [
      { id: "m1", role: "user", content: "Make a dark SaaS page.", timestamp: "2024-01-20T10:00:00Z" },
      { id: "m2", role: "assistant", content: "I've generated a dark layout with purple accents.", timestamp: "2024-01-20T10:01:00Z" }
    ]
  },
  {
    id: "proj_2",
    name: "Coffee Brew E-commerce",
    initial_prompt: "A cozy, minimalist shop for organic coffee beans with earthy tones.",
    current_code: "<div class='bg-stone-100 p-10 text-stone-900'>...</div>",
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-19T14:20:00Z",
    userId: "user_01",
    isPublished: false,
    current_version_index: "0",
    versions: [],
    conversation: [
      { id: "m3", role: "user", content: "I need a coffee shop site.", timestamp: "2024-01-18T09:15:00Z" },
      { id: "m4", role: "assistant", content: "Sure, I'll use cream and brown tones.", timestamp: "2024-01-18T09:16:00Z" }
    ]
  },
  {
    id: "proj_3",
    name: "Crypto Pulse Tracker",
    initial_prompt: "Real-time crypto dashboard with glass cards and neon green charts.",
    current_code: "<div>Dashboard Code</div>",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
    userId: "user_01",
    isPublished: true,
    current_version_index: "0",
    versions: [],
    conversation: []
  },
  {
    id: "proj_4",
    name: "FitTrack Pro",
    initial_prompt: "Workout logging app with a clean, high-energy orange and white theme.",
    current_code: "<div>Fitness App</div>",
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
    userId: "user_01",
    isPublished: false,
    current_version_index: "0",
    versions: [],
    conversation: [
      { id: "m5", role: "user", content: "Add a calorie counter.", timestamp: "2024-01-12T11:05:00Z" }
    ]
  },
  {
    id: "proj_5",
    name: "Zen Meditation App",
    initial_prompt: "A peaceful meditation timer with blurred background images and soft typography.",
    current_code: "<div>Breathe...</div>",
    createdAt: "2024-01-10T15:45:00Z",
    updatedAt: "2024-01-10T16:00:00Z",
    userId: "user_01",
    isPublished: true,
    current_version_index: "0",
    versions: [],
    conversation: []
  },
  {
    id: "proj_6",
    name: "Modern Portfolio V1",
    initial_prompt: "Minimalist portfolio for a UI/UX designer using a grid system.",
    current_code: "<div>My Work</div>",
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-08T12:00:00Z",
    userId: "user_01",
    isPublished: true,
    current_version_index: "0",
    versions: [],
    conversation: []
  },
  {
    id: "proj_7",
    name: "Smart Home Controller",
    initial_prompt: "An interface to control IoT devices with glass sliders and toggles.",
    current_code: "<div>IoT Dashboard</div>",
    createdAt: "2024-01-05T09:30:00Z",
    updatedAt: "2024-01-06T11:15:00Z",
    userId: "user_01",
    isPublished: false,
    current_version_index: "0",
    versions: [],
    conversation: []
  },
  {
    id: "proj_8",
    name: "Cyberpunk Blog",
    initial_prompt: "Blog layout with neon pink borders, glitch effects, and dark textures.",
    current_code: "<div>Glitchy Blog</div>",
    createdAt: "2024-01-03T14:00:00Z",
    updatedAt: "2024-01-03T14:00:00Z",
    userId: "user_01",
    isPublished: true,
    current_version_index: "0",
    versions: [],
    conversation: []
  },
  {
    id: "proj_9",
    name: "Recipe Finder Bot",
    initial_prompt: "Searchable database for recipes with high-quality food photography.",
    current_code: "<div>Food App</div>",
    createdAt: "2024-01-02T10:20:00Z",
    updatedAt: "2024-01-02T11:00:00Z",
    userId: "user_01",
    isPublished: false,
    current_version_index: "0",
    versions: [],
    conversation: []
  },
  {
    id: "proj_10",
    name: "Fintech Billing UI",
    initial_prompt: "Professional dashboard for managing invoices and subscription plans.",
    current_code: "<div>Invoicing System</div>",
    createdAt: "2024-01-01T23:59:59Z",
    updatedAt: "2024-01-01T23:59:59Z",
    userId: "user_01",
    isPublished: true,
    current_version_index: "0",
    versions: [],
    conversation: []
  }
];
const Projects = () => {
  const { projectId } = useParams();
  console.log(projectId)
  const navigate = useNavigate();
  const [project, setproject] = useState<Project | null>(null)
  const [loading, setloading] = useState(true)
  const [isGenerate, setisGenerate] = useState(false)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")
  const [isSaving, setisSaving] = useState(false)

  const fetchProjects = async () => {
    const project = DUMMY_PROJECTS.find(project => project.id === projectId)
    setTimeout(() => {
      if (project) {
        setproject(project);
        setloading(false);
        setisGenerate(project.current_code ? false : true);
      }
    }, 2000)
  }

  useEffect(() => {
    fetchProjects()
  }, [projectId])

  return (
    <div className='h-[calc(100vh-72px)]'>
      {loading ? (
        <div className='h-screen w-full flex justify-center items-center'>
          <Loader2Icon className="animate-spin size-10" />
        </div>
      ) : (
        project ? (
          <div> hi
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