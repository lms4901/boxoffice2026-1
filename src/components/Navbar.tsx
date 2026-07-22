import React from "react";
import { Film, Sparkles, Calendar, Clapperboard } from "lucide-react";

interface NavbarProps {
  currentDateStr: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentDateStr }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-rose-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                KOBIS 박스오피스
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                공식 API
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              영화진흥위원회 통합전산망 일별 순위 및 상세정보
            </p>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>선택 일자: <strong className="text-slate-200 font-medium">{currentDateStr}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>실시간 연결</span>
          </div>
        </div>
      </div>
    </header>
  );
};
