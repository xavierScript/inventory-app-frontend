"use client";

import { Search, Bell } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between h-20 px-8 bg-white border-b">
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-slate-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product"
            className="py-2 pl-10 pr-4 transition-colors border rounded-md w-96 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <Image
            src="/user.svg"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="text-right">
            <div className="font-semibold text-slate-800">User</div>
            <div className="text-sm text-slate-500">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
