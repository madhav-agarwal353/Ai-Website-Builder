import { useState } from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Projects from './pages/Projects'
import MyProjects from './pages/MyProjects'
import Preview from './pages/Preview'
import Community from './pages/Community'
import View from './pages/View'
import Navbar from './components/Navbar'
function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith('/projects/')
    && pathname !== '/projects' ||
    pathname.startsWith('/view/') ||
    pathname.startsWith('/preview/');


  return (

    <section className="bg-gray-900 purpple-scrollbar">
      <main className="  bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-gradient-2.png')] bg-cover text-center text-sm text-white max-md:px-4">
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/projects/:projectId' element={<Projects />} />
          <Route path='/projects' element={<MyProjects />} />
          <Route path='/preview/:projectId' element={<Preview />} />
          <Route path='/preview/:projectId/:versionId' element={<Preview />} />
          <Route path='/community' element={<Community />} />
          <Route path='/view/:id' element={<View />} />
        </Routes>
      </main>
    </section >
  )
}

export default App
