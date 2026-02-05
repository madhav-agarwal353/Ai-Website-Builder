import { useState } from "react";
import Navbar from "../components/Navbar";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { api } from "@/configs/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const [prompt, setPrompt] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const handlePromptClick = (text: string): void => {
        setPrompt(text);
    };

    const handleSubmit = async () => {
        try {
            if (!session?.user) {
                toast.error('Please sign in to create a project');
                return;
            }
            if (prompt.trim().length === 0) {
                toast.error('Please enter a prompt');
                return;
            }
            setLoading(true);
            const { data } = await api.post('/api/user/project', { initial_prompt: prompt });
            setLoading(false);
            console.log("Project created:", data);
            navigate(`/projects/${data.projectId}`);
        }
        catch (error) {
            console.error("Error creating project:", error);
            toast.error('Failed to create project');
            setLoading(false);
        };
    }

    return (
        <div className="flex flex-col items-center justify-between h-[calc(100vh-72px)] pt-40">
            {/* Hero Content */}
            <div className="flex w-full flex-col items-center justify-center">
                <h1 className="text-4xl md:text-[40px]">
                    Build Websites with AI
                </h1>

                <p className="mt-6 text-base">
                    Describe your website and let AI design and generate it for you.
                </p>

                <div className="mt-4 w-full max-w-xl overflow-hidden rounded-xl bg-white">
                    <textarea
                        rows={3}
                        value={prompt}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setPrompt(e.target.value)
                        }
                        placeholder="Describe the website you want to create..."
                        className="w-full resize-none bg-transparent p-3 pb-0 text-black outline-none"
                    />
                    <div className="flex items-center justify-between px-3 pb-3">
                        <button
                            className="flex size-6 items-center justify-center rounded-full bg-gray-500 p-1"
                            aria-label="Add"
                        >
                            +
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center px-4 justify-center rounded bg-indigo-600 p-1"
                            aria-label="Send"
                        >
                            {!loading ? '↑' : (
                                <div className="flex gap-2 items-center">
                                    <span>Creating</span><span><Loader2Icon className="animate-spin size-4" /></span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Website Suggestions */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-slate-400">
                    <p
                        className="cursor-pointer hover:text-white"
                        onClick={() =>
                            handlePromptClick(
                                "Create a modern landing page for a startup"
                            )
                        }
                    >
                        Create a landing page
                    </p>

                    <p
                        className="cursor-pointer hover:text-white"
                        onClick={() =>
                            handlePromptClick(
                                "Build a professional business website"
                            )
                        }
                    >
                        Build a business website
                    </p>

                    <div className="col-span-2 h-px bg-gray-400/50" />

                    <p
                        className="cursor-pointer hover:text-white"
                        onClick={() =>
                            handlePromptClick(
                                "Design a personal portfolio website"
                            )
                        }
                    >
                        Create a portfolio website
                    </p>

                    <p
                        className="cursor-pointer hover:text-white"
                        onClick={() =>
                            handlePromptClick(
                                "Generate an e-commerce website design"
                            )
                        }
                    >
                        Build an e-commerce website
                    </p>
                </div>
            </div>

            <p className="pb-3 text-gray-400">
                By creating a website with AI, you agree to our{" "}
                <a href="#" className="underline">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                    Privacy Policy
                </a>.
            </p>
        </div>
    );
}
