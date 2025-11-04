import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Enhanced hook for sidebar with responsive behavior
const useSidebarToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Reset mobile state when going to desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return { isOpen, toggle, close, isMobile };
};

// Main Dashboard Component
const Dashboard = () => {
  const { isOpen, toggle, close, isMobile } = useSidebarToggle();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onClose={close} isMobile={isMobile} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all overflow-hidden duration-300 ${!isMobile ? 'ml-0' : ''}`}>
        {/* Header */}
        <Header onMenuClick={toggle} isMobile={isMobile} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-2 py-4 md:p-6 max-w-7xl mx-auto w-full">
          <Outlet /> {/* This will render the current route */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;