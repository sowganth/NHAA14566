import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import RoleSelector from './RoleSelector';
import { Shield, FileText, Activity, Users, FileCheck, Lock, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/cases', label: 'Cases', icon: Users },
    { path: '/new-assessment', label: 'New Assessment', icon: PlusCircle },
    { path: '/support-actions', label: 'Support Actions', icon: FileCheck },
    { path: '/referrals', label: 'Referrals', icon: FileText },
    { path: '/audit-log', label: 'Audit Log', icon: Shield },
    { path: '/privacy', label: 'Privacy & RBAC', icon: Lock },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top National Helpline Banner */}
      <div className="bg-slate-950 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">National Helpline Against Atrocities (NHAA) 14566</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">Government of India Decision-Support Network</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/30 font-bold">
            DEMO DATA MODE
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm shadow">
              14566
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block leading-tight text-slate-100">NHAA MODULE 3</span>
              <span className="text-[10px] text-slate-400 block tracking-wider uppercase">Authority & Case Portal</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 border border-slate-700 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <RoleSelector />
        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="lg:hidden bg-slate-950 px-4 py-2 border-t border-slate-800 overflow-x-auto flex space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
