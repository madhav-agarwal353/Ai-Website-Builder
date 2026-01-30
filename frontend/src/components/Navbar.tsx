import { authClient } from '@/lib/auth-client';
import React from 'react'
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserButton } from "@daveyplate/better-auth-ui";
import image from "../../public/favicon.png"
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();

    return (
        <nav className="flex w-full items-center justify-between py-4 md:px-16 lg:px-24 xl:px-32 z-50 sticky">
            <a href="/" aria-label="PrebuiltUI">
                <img src={image} alt="" className='h-[72px]'/>
            </a>

            {/* Menu */}
            <div
                className={`flex items-center gap-8 font-medium transition-all duration-300 max-md:fixed max-md:left-0 max-md:top-0 max-md:h-[785px] max-md:flex-col max-md:justify-center max-md:bg-black/50 max-md:backdrop-blur ${menuOpen ? "max-md:w-full" : "max-md:w-0 max-md:overflow-hidden"
                    }`}
            >
                <Link to='/'>Home</Link>
                <Link to='/projects'>My Project</Link>
                <Link to='/pricing'>Pricing</Link>
                <Link to='/community'>Community</Link>
                <button
                    aria-label="Close menu"
                    className="size-6 md:hidden"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>
            </div >
            {!session?.user ? (<button className="hidden rounded-full border border-gray-600 bg-white px-6 py-2 text-black transition hover:bg-gray-200 active:scale-95 md:block" onClick={() => navigate('/auth/signin')}>
                Get Started
            </button>) : (
                <UserButton size='icon' className='rounded-full bg-white px-6 py-2 text-black transition hover:bg-gray-200 active:scale-95' />
            )
            }
            <button
                aria-label="Open menu"
                className="size-6 md:hidden"
                onClick={() => setMenuOpen(true)}
            >
                ☰
            </button>
        </nav >
    )
}

export default Navbar