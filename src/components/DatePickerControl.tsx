import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { formatKoreanDate, formatDateToYYYYMMDD, getYesterdayDate } from "../utils/dateUtils";

interface DatePickerControlProps {
  selectedDateStr: string; // YYYY-MM-DD
  yesterdayStr: string; // YYYY-MM-DD
  onDateChange: (newDateStr: string) => void;
  isLoading: boolean;
}

export const DatePickerControl: React.FC<DatePickerControlProps> = ({
  selectedDateStr,
  yesterdayStr,
  onDateChange,
  isLoading,
}) => {
  // Calculate relative dates for preset buttons
  const isYesterday = selectedDateStr === yesterdayStr;
  const isAtMaxDate = selectedDateStr >= yesterdayStr;

  const handlePrevDay = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() - 1);
    onDateChange(formatDateToYYYYMMDD(d));
  };

  const handleNextDay = () => {
    if (isAtMaxDate) return;
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() + 1);
    const nextStr = formatDateToYYYYMMDD(d);
    if (nextStr <= yesterdayStr) {
      onDateChange(nextStr);
    }
  };

  const setDaysAgo = (days: number) => {
    const d = getYesterdayDate();
    d.setDate(d.getDate() - days);
    const targetStr = formatDateToYYYYMMDD(d);
    onDateChange(targetStr);
  };

  const handleResetToYesterday = () => {
    onDateChange(yesterdayStr);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Main Date Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={handlePrevDay}
              disabled={isLoading}
              title="이전 날짜"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative flex items-center px-2">
              <CalendarIcon className="w-4 h-4 text-rose-400 absolute left-4 pointer-events-none" />
              <input
                type="date"
                value={selectedDateStr}
                max={yesterdayStr}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val <= yesterdayStr) {
                    onDateChange(val);
                  }
                }}
                disabled={isLoading}
                className="bg-transparent text-slate-100 font-semibold text-sm pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={handleNextDay}
              disabled={isLoading || isAtMaxDate}
              title={isAtMaxDate ? "어제 날짜까지만 조회 가능합니다" : "다음 날짜"}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Formatted Korean Date Banner */}
          <div className="bg-slate-800/80 border border-slate-700/60 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-slate-400">조회일:</span>
            <span className="text-sm font-bold text-amber-300">
              {formatKoreanDate(selectedDateStr)}
            </span>
            {isYesterday && (
              <span className="text-[11px] font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md">
                최신 (어제)
              </span>
            )}
          </div>
        </div>

        {/* Quick Date Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">빠른 이동:</span>
          
          <button
            onClick={handleResetToYesterday}
            disabled={isLoading || isYesterday}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
              isYesterday
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            어제 (디폴트)
          </button>

          <button
            onClick={() => setDaysAgo(2)} // 3일 전 (어제에서 2일 더 전)
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-all"
          >
            3일 전
          </button>

          <button
            onClick={() => setDaysAgo(6)} // 7일 전
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-all"
          >
            1주일 전
          </button>

          <button
            onClick={() => setDaysAgo(29)} // 30일 전
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-all"
          >
            1개월 전
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        영화진흥위원회(KOBIS) 규정에 따라 당일 집계 데이터는 다음날 제공되므로 선택은 <strong>어제 날짜({yesterdayStr})</strong>까지만 제한됩니다.
      </p>
    </div>
  );
};
