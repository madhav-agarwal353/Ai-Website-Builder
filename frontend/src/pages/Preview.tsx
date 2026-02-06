import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { ProjectPreview } from "../components/ProjectPreview"
import type { Project } from "../types"
import { api } from "@/configs/axios";

const Preview = () => {
  const { projectId } = useParams();
  const [code, setcode] = useState('');
  const [loading, setloading] = useState(true)

  const fetchCode = async () => {
    try {
      setloading(true);
      const data = await api.get(`/api/preview/${projectId}`);
      setcode(data.data.current_code);
      setloading(false);
    } catch (error) {
      console.error("Error fetching preview code:", error);
      setloading(false);
    }
  }

  useEffect(() => {
    fetchCode();
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className='size-7 animate-spin' />
      </div>
    )
  }

  return (
    <div className='h-screen'>
      {code && <ProjectPreview project={{ current_code: code } as Project} isGenerate={false} showEditorPanel={false} />}
    </div>
  )
}

export default Preview