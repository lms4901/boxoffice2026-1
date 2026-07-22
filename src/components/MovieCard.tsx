import React from "react";
import { DailyBoxOfficeItem } from "../types";
import { formatNumber } from "../utils/dateUtils";
import { Crown, Sparkles, TrendingUp, TrendingDown, Minus, Eye, Film, Tv, Monitor } from "lucide-react";

interface MovieCardProps {
  item: DailyBoxOfficeItem;
  topAudienceCount: number;
  onSelectMovie: (movieCd: string, item: DailyBoxOfficeItem) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, topAudienceCount, onSelectMovie }) => {
  const rankNum = parseInt(item.rank, 10);
  const rankIntenNum = parseInt(item.rankInten, 10);
  const audiCntNum = parseInt(item.audiCnt, 10) || 0;
  const audiAccNum = parseInt(item.audiAcc, 10) || 0;
  
  // Percentage relative to top movie's audience
  const audienceBarPercent = topAudienceCount > 0 ? Math.min(100, Math.round((audiCntNum / topAudienceCount) * 100)) : 0;

  // Rank styling
  const getRankBadge = () => {
    if (rankNum === 1) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 relative overflow-hidden group-hover:scale-105 transition-transform">
          <Crown className="w-3.5 h-3.5 absolute top-1 right-1 text-slate-900 opacity-80" />
          <span>1</span>
        </div>
      );
    }
    if (rankNum === 2) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md shadow-slate-400/20 group-hover:scale-105 transition-transform">
          <span>2</span>
        </div>
      );
    }
    if (rankNum === 3) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-800/20 group-hover:scale-105 transition-transform">
          <span>3</span>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xl flex items-center justify-center border border-slate-700/80 group-hover:scale-105 transition-transform">
        <span>{rankNum}</span>
      </div>
    );
  };

  // Rank Change Tag
  const renderRankChange = () => {
    if (item.rankOldAndNew === "NEW") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          <Sparkles className="w-3 h-3" />
          NEW
        </span>
      );
    }
    if (rankIntenNum > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
          <TrendingUp className="w-3 h-3" />
          {rankIntenNum}
        </span>
      );
    }
    if (rankIntenNum < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
          <TrendingDown className="w-3 h-3" />
          {Math.abs(rankIntenNum)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-400 bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded-md">
        <Minus className="w-3 h-3" />
        변동없음
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelectMovie(item.movieCd, item)}
      className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 md:p-5 shadow-xl hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Background Subtle Gradient for #1 */}
      {rankNum === 1 && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Section: Rank Badge & Main Title */}
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          {getRankBadge()}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                {item.movieNm}
              </h3>
              {renderRankChange()}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>개봉일: <strong className="text-slate-300">{item.openDt || "정보없음"}</strong></span>
              <span className="text-slate-700">•</span>
              <span>스크린: <strong className="text-slate-300">{formatNumber(item.scrnCnt)}개</strong></span>
              <span className="text-slate-700">•</span>
              <span>상영회수: <strong className="text-slate-300">{formatNumber(item.showCnt)}회</strong></span>
            </div>
          </div>
        </div>

        {/* Right Section: Audience Counts & Sales Share */}
        <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0 gap-2 min-w-[200px]">
          {/* Daily Audience */}
          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-400 font-medium">일별 관객수</div>
            <div className="text-lg font-extrabold text-slate-100 group-hover:text-amber-400 transition-colors">
              {formatNumber(audiCntNum)} <span className="text-xs font-normal text-slate-400">명</span>
            </div>
          </div>

          {/* Cumulative Audience */}
          <div className="text-right">
            <div className="text-[11px] text-slate-400">누적 관객수</div>
            <div className="text-xs font-semibold text-slate-300">
              {formatNumber(audiAccNum)}명
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Sales Share */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>관객 비율 (1위 대비)</span>
            <span className="font-semibold text-slate-300">매출 점유율 {item.salesShare}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                rankNum === 1
                  ? "bg-gradient-to-r from-amber-500 to-rose-500"
                  : rankNum <= 3
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                  : "bg-slate-600"
              }`}
              style={{ width: `${Math.max(audienceBarPercent, 2)}%` }}
            />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectMovie(item.movieCd, item);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 group-hover:text-amber-300 shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">상세정보</span>
        </button>
      </div>
    </div>
  );
};
