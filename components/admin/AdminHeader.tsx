"use client";

import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAdminAuth } from "@/app/(admin)/context/AdminAuthContext";
import { useState, useRef, useEffect } from "react";

interface AdminHeaderProps {
    isSidebarCollapsed: boolean;
}

export default function AdminHeader({ isSidebarCollapsed }: AdminHeaderProps) {
    const { user, logout } = useAdminAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className={`
                bg-white shadow-sm h-16 fixed top-0 z-40
                transition-all duration-300
                ${isSidebarCollapsed ? "left-[72px]" : "left-64"}
                right-0
            `}
        >
            <div className="h-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-full">
                    <div className="flex-1 flex items-center">
                        <div className="max-w-2xl w-full lg:max-w-xs relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-gray-500">
                            <FaBell className="h-6 w-6" />
                        </button>

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 focus:outline-none"
                            >
                                <FaUserCircle className="h-8 w-8 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.name}
                                </span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                    <button
                                        onClick={() => logout()}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
