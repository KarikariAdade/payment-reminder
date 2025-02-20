import React, {useState} from "react";
import {ChevronDown, ChevronUp, Home, LogOut, Menu, Settings} from "lucide-react";


export const Dashboard = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <>
            <div
                className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between">
                    {!isCollapsed && <span className="text-xl font-bold">Dashboard</span>}
                    <Menu className="w-6 h-6 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}/>
                </div>

                {/* Navigation */}
                <nav className="mt-5 space-y-2">
                    {/* Home */}
                    <NavItem icon={<Home/>} text="Home" isCollapsed={isCollapsed}/>

                    {/* Dropdown Menu */}
                    <div>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-700 transition"
                        >
                            <Menu className="w-5 h-5 mr-3"/>
                            {!isCollapsed && <span>Menu</span>}
                            {!isCollapsed && (
                                isDropdownOpen ? <ChevronUp className="ml-auto w-4 h-4"/> :
                                    <ChevronDown className="ml-auto w-4 h-4"/>
                            )}
                        </button>
                        {isDropdownOpen && (
                            <div className="ml-10 space-y-2">
                                <NavItem text="Submenu 1" isCollapsed={isCollapsed}/>
                                <NavItem text="Submenu 2" isCollapsed={isCollapsed}/>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <NavItem icon={<Settings/>} text="Settings" isCollapsed={isCollapsed}/>
                </nav>

                {/* Logout */}
                <div className="absolute bottom-5 w-full">
                    <NavItem icon={<LogOut/>} text="Logout" isCollapsed={isCollapsed}/>
                </div>
            </div>
        </>
    )


}

interface NavItemProps {
    icon?: React.ReactNode;
    text: string;
    isCollapsed: boolean;
}

const NavItem = ({ icon, text, isCollapsed }: NavItemProps) => (
    <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 transition">
        {icon && <span className="w-5 h-5 mr-3">{icon}</span>}
        {!isCollapsed && <span>{text}</span>}
    </a>
);