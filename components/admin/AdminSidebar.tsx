"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    FaBuilding,
    FaUsers,
    FaCog,
    FaChartBar,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

interface AdminSidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ onCollapse }: AdminSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { icon: FaChartBar, label: "Dashboard", href: "/admin" },
        { icon: FaBuilding, label: "Clínicas", href: "/admin/clinicas" },
        { icon: FaUsers, label: "Usuários", href: "/admin/usuarios" },
        { icon: FaCog, label: "Configurações", href: "/admin/configuracoes" },
    ];

    const handleCollapse = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onCollapse?.(newCollapsed);
    };

    const isActiveLink = (href: string) => pathname === href;

    return (
        <aside
            className={`
                bg-[#2A3547] fixed top-0 left-0 z-50
                h-screen overflow-y-auto overflow-x-hidden
                transition-all duration-300 ease-in-out
                flex flex-col
                ${isCollapsed ? "w-[72px]" : "w-64"}
                scrollbar-thin scrollbar-thumb-[#323e4f] scrollbar-track-[#2A3547]
            `}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-6 flex-shrink-0 sticky top-0 bg-[#2A3547] z-10">
                <div className="text-blue-400 font-bold text-xl">
                    {isCollapsed ? "CX" : "CLINX"}
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 pb-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center h-12 px-3 mb-1 rounded-lg
                                transition-colors duration-200
                                ${
                                    isActiveLink(item.href)
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-300 hover:bg-[#323e4f]"
                                }
                            `}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span
                                className={`
                                    ml-3 whitespace-nowrap
                                    transition-all duration-300
                                    ${isCollapsed ? "w-0 opacity-0" : "w-40 opacity-100"}
                                `}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Button */}
            <button
                onClick={handleCollapse}
                className="
                    h-12 w-full flex items-center px-6
                    text-gray-300 hover:bg-[#323e4f]
                    transition-colors duration-200
                "
            >
                {isCollapsed ? (
                    <FaChevronRight className="w-5 h-5" />
                ) : (
                    <>
                        <FaChevronLeft className="w-5 h-5" />
                        <span className="ml-3">Recolher</span>
                    </>
                )}
            </button>
        </aside>
    );
}
