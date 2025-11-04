import { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Gift, 
  Wallet, 
  FileCheck, 
  Download,
  X,
  User
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLogo from '../assets/outer_logo-CnpqYOqg.png'
const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
 
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const menuItems = [
    { name: 'HOME', icon: Home, path: '/', badge: null },
    { name: 'INV FUND', icon: TrendingUp, path: '/inv-fund', badge: 'New' },
    { name: 'WALLET', icon: Wallet, path: '/wallet', badge: null },
    { name: 'KYC', icon: FileCheck, path: '/kyc', badge: null },
    { name: 'PROMOTION', icon: Gift, path: '/promotion', badge: '3' },
    { name: 'DOWNLOAD APK', icon: Download, path: '/download', badge: null },
  ];

  return (
    <>
      {/* Mobile Overlay with blur effect */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'sticky'} left-0 top-0 h-screen min-w-60 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
        text-white z-50 transform transition-all duration-500 ease-out
        ${isOpen && isMobile ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'}
        ${!isMobile ? 'shadow-2xl shadow-gray-900/50' : ''}
        backdrop-blur-xl border-r border-gray-700/50
      `}>
        {/* Logo Section */}
        <div className="py-2 px-4 border-b border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
          <div className="relative flex items-center">
            {/* <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 rotate-12 hover:rotate-0 transition-transform duration-500">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FUTURE TRADE
              </span>
              <p className="text-xs text-gray-400 mt-1">Trading Platform</p>
            </div> */}
            <img src={SidebarLogo} alt="" className='w-40 animate-pulse' />
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-3 text-gray-400 hover:text-red-500 hover:bg-gray-800 hover:animate-pulse rounded-xl transition-all duration-300 z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* Menu Items */}
        <nav className="mt-8 px-0 space-y-3.5">
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  w-full text-xs flex items-center justify-between px-3 py-[9px] rounded text-left transition-all duration-300
                  transform hover:translate-x-0 hover:scale-100 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#6B7280] to-[#6B7280] text-white shadow-lg shadow-green-500/25' 
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Background animation */}
                {({ isActive }) => (
                  <>
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 border-l-4 border-l-green-500 rounded
                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
                      ${isActive ? 'scale-x-100' : ''}
                    `}></div>
                    
                    <div className="relative flex items-center space-x-4 z-10">
                      <item.icon 
                        size={20} 
                        className={`transition-all duration-100 ${hoveredItem === item.name ? 'scale-110 rotate-12' : ''}`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    
                    {/* {item.badge && (
                      <span className={`
                        relative z-10 px-2 py-1 text-[10px] font-bold rounded-full
                        ${item.badge === 'New' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                        }
                        animate-pulse
                      `}>
                        {item.badge}
                      </span>
                    )} */}
                  </>
                )}
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;