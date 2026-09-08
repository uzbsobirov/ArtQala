'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Users,
  Layers,
  Percent,
  MessageSquare,
  Wrench,
  Users2,
  Star,
  Settings,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/paintings', label: 'Paintings', icon: Palette },
    { href: '/admin/artists', label: 'Artists', icon: Users },
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/discounts', label: 'Discounts', icon: Percent },
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/admin/services', label: 'Service Requests', icon: Wrench },
    { href: '/admin/customers', label: 'Customers', icon: Users2 },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const getActiveTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.startsWith('/admin/paintings')) return 'Paintings';
    if (pathname.startsWith('/admin/artists')) return 'Artists';
    if (pathname.startsWith('/admin/categories')) return 'Categories';
    if (pathname.startsWith('/admin/discounts')) return 'Discounts';
    if (pathname.startsWith('/admin/inquiries')) return 'Inquiries';
    if (pathname.startsWith('/admin/services')) return 'Service Requests';
    if (pathname.startsWith('/admin/customers')) return 'Customers';
    if (pathname.startsWith('/admin/reviews')) return 'Reviews';
    if (pathname.startsWith('/admin/settings')) return 'Settings';
    return 'Admin';
  };

  return (
    <div className="flex min-h-screen bg-[#FAF4EC] text-[#281C18]">
      {/* Sidebar matching AdminDashboard.dc.html */}
      <aside className="w-[236px] bg-[#1D100B] text-[#D8CDC4] flex flex-col shrink-0 border-r border-[#382620]">
        {/* Admin Logo */}
        <div className="p-6 border-b border-[#382620]">
          <Link href="/admin" className="font-serif text-xl font-bold tracking-wide text-[#FAF4EC] flex items-center gap-1">
            <span>Art</span>
            <span className="text-[#DAA932]">Qala</span>
            <span className="text-xs font-sans tracking-normal uppercase text-[#429599] ml-1 px-1.5 py-0.5 bg-[#429599]/15 rounded">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-2.5 text-xs font-semibold tracking-wide transition-all border-l-[3px] ${
                  isActive
                    ? 'bg-[#281C18] text-[#FAF4EC] border-[#BA4E25]'
                    : 'border-transparent text-[#B5A599] hover:bg-[#281C18]/50 hover:text-[#FAF4EC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#BA4E25]' : 'text-[#8F7E73]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Client Site */}
        <div className="p-4 border-t border-[#382620]">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-[#5AB3B7] hover:underline p-2 rounded hover:bg-[#281C18]"
          >
            <span>Visit Gallery Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#FDFBF9] border-b border-[#E7E0D8] px-8 flex items-center justify-between shrink-0">
          <h1 className="font-serif text-2xl font-semibold text-[#281C18]">
            {getActiveTitle()}
          </h1>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-medium text-[#726861] hover:text-[#BA4E25] hidden sm:inline"
            >
              Live Site
            </Link>

            {/* Admin User Profile */}
            <div className="flex items-center gap-2.5 pl-4 border-l border-[#E7E0D8]">
              <div className="w-8 h-8 rounded-full bg-[#BA4E25] text-white font-serif font-bold text-xs flex items-center justify-center shadow-xs">
                AN
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <div className="text-xs font-bold text-[#281C18]">Anvar</div>
                <div className="text-[10px] text-[#8F8178]">Head Curator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
