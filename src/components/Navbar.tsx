import React from 'react'
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <nav className="flex w-full items-center justify-between py-4 md:px-16 lg:px-24 xl:px-32 z-50 sticky">
            <a href="https://prebuiltui.com" aria-label="PrebuiltUI">
                {/* Logo SVG */}
                <svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.904 28.28q-1.54 0-2.744-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.82 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.868 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.456.924-3.276.924" fill="white" />
                    <path d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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

            <button className="hidden rounded-full border border-gray-600 bg-white px-6 py-2 text-black transition hover:bg-gray-200 active:scale-95 md:block" onClick={() => navigate('/auth/signin')}>
                Get Started
            </button>

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