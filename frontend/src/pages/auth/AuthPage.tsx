import { useParams } from "react-router-dom"
import { AuthView } from "@daveyplate/better-auth-ui"

export default function AuthPage() {
    const { pathname } = useParams()

    return (
        <main className="
//   h-[calc(100vh-72px)]
//   mx-auto
//   flex grow flex-col
//   items-center justify-center
//   rounded-2xl
//   shadow-xl
//   border border-white/20
">
            <AuthView pathname={pathname} className=" bg-white/10   backdrop-blur-xl" />
        </main>

    )
}