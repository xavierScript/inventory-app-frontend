"use client";

import {
  Home,
  Package,
  BarChart2,
  User,
  Building,
  Settings,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavLink = ({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
}) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center p-3 rounded-lg transition-colors relative ${
        isActive
          ? "text-emerald-700 bg-emerald-50"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="w-6 h-6 mr-4" />
      <span className="font-medium">{children}</span>
      {isActive && (
        <motion.div
          className="absolute left-0 w-1 h-full bg-emerald-600 rounded-r-full"
          layoutId="active-nav-link"
        />
      )}
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="flex flex-col w-72 bg-white border-r shadow-md">
      <div className="flex items-center justify-center h-20 border-b">
        <div className="text-2xl font-bold text-emerald-600">NGIC</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink href="/dashboard" icon={Home}>
            Dashboard
          </NavLink>
          <NavLink href="/inventory" icon={Package}>
            Inventory
          </NavLink>
          <NavLink href="/reports" icon={BarChart2}>
            Reports
          </NavLink>
        </nav>
      </div>
      <div className="p-4 border-t">
        <nav className="flex flex-col space-y-2">
          <NavLink href="/settings" icon={Settings}>
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
