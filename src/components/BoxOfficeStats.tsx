import React from "react";
import { Users, DollarSign, Crown, Sparkles, TrendingUp } from "lucide-react";
import { DailyBoxOfficeItem } from "../types";
import { formatNumber, formatKoreanWon } from "../utils/dateUtils";

interface BoxOfficeStatsProps {
  items: DailyBoxOfficeItem[];
  showRange?: string;
}

export const BoxOfficeStats: React.FC<BoxOfficeStatsProps> = ({ items, showRange }) => {
  if (!items || items.length === 0) return null;

  // Calculate total audience in top 10
  const totalAudience = items.reduce((acc, curr) => acc + (parseInt(curr.audiCnt, 10) || 0), 0);
  
  // Calculate total sales in top 10
  const totalSales = items.reduce((acc, curr) => acc + (parseInt(curr.salesAmt, 10) || 0), 0);

  // Top 1 Movie
  const top1Movie = items.find((item) => item.rank === "1") || items[0];
  const top1Share = top1Movie ? top1Movie.salesShare : "0";

  // Count NEW entries
  const newEntriesCount = items.filter((item) => item.rankOldAndNew === "NEW").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      {/* Stat 1: Total Audience */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">TOP10 일일 총 관객</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
          {formatNumber(totalAudience)} <span className="text-sm font-normal text-slate-400">명</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          상위 10개 작품 총 합계
        </p>
      </div>

      {/* Stat 2: Total Sales */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">TOP10 일일 총 매출액</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
          {formatKoreanWon(totalSales)}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          {formatNumber(totalSales)}원
        </p>
      </div>

      {/* Stat 3: Top 1 Share */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">1위 점유율 ({top1Movie?.movieNm.slice(0, 8)}...)</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Crown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">
          {top1Share}%
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(parseFloat(top1Share) || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Stat 4: New Entries */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">신규 진입 작품</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl md:text-2xl font-black text-rose-400 tracking-tight">
          {newEntriesCount} <span className="text-sm font-normal text-slate-400">개 작품</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {newEntriesCount > 0 ? "차트 신규 랭크인 차밍 포인트!" : "기존 상위권 유지 중"}
        </p>
      </div>
    </div>
  );
};
