import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-gray-300" />,
      }}
      toastOptions={{
        className: `
          bg-gray-900/60
          backdrop-blur-lg
          border border-white/10
          rounded-xl
          shadow-2xl
          text-gray-100
        `,
        descriptionClassName: "text-gray-400",
      }}
      style={
        {
          "--normal-bg": "rgba(17, 24, 39, 0.6)",
          "--normal-text": "#e5e7eb",
          "--normal-border": "rgba(255,255,255,0.1)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
