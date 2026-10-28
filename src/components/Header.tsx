import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full bg-[#0b0f17] border-b border-slate-800 text-slate-100 pl-2 md:pl-4 pr-4 md:pr-8 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/" className="flex items-center m-0 p-0 hover:opacity-90 transition">
          <Image 
            src="/logo 2.png" 
            alt="SARJOM EXAM" 
            width={190} 
            height={50} 
            className="object-contain h-12 w-auto mix-blend-screen brightness-125 contrast-110" 
            priority 
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
          <Link href="/exams" className="hover:text-emerald-400 transition">Exams</Link>
          <Link href="/pyq" className="hover:text-emerald-400 transition">PYQ Practice</Link>
          <Link href="/syllabus" className="hover:text-emerald-400 transition">Syllabus</Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <Link href="/login" className="relative z-50 px-6 py-2 text-sm font-bold bg-[#b5e225] text-black rounded-lg hover:bg-[#a2ce18] transition cursor-pointer shadow-sm">
          Login
        </Link>
      </div>
    </header>
  );
}

export default Header;
