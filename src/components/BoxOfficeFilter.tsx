import React from "react";
import { Search, ArrowUpDown, Filter, Sparkles, X } from "lucide-react";

export type SortField = "rank" | "audiCnt" | "audiAcc" | "salesShare";
export type FilterType = "all" | "NEW";

interface BoxOfficeFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortField;
  onSortChange: (sort: SortField) => void;
  filterType: FilterType;
  onFilterTypeChange: (filter: FilterType) => void;
  totalCount: number;
  filteredCount: number;
}

export const BoxOfficeFilter: React.FC<BoxOfficeFilterProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterType,
  onFilterTypeChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="영화 제목 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/80 text-slate-100 text-sm pl-10 pr-9 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter: All vs NEW */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onFilterTypeChange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "all"
                  ? "bg-slate-800 text-slate-100 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              전체 ({totalCount})
            </button>
            <button
              onClick={() => onFilterTypeChange("NEW")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filterType === "NEW"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3 h-3 text-rose-400" />
              NEW 신규
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">정렬:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortField)}
              className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="rank" className="bg-slate-900 text-slate-100">박스오피스 순위순</option>
              <option value="audiCnt" className="bg-slate-900 text-slate-100">일별 관객수순</option>
              <option value="audiAcc" className="bg-slate-900 text-slate-100">누적 관객수순</option>
              <option value="salesShare" className="bg-slate-900 text-slate-100">매출 점유율순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Result Count feedback */}
      {searchQuery && (
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between px-1">
          <span>&apos;{searchQuery}&apos; 검색 결과: <strong>{filteredCount}개</strong> 항목</span>
          <button
            onClick={() => onSearchChange("")}
            className="text-rose-400 hover:underline"
          >
            검색 초기화
          </button>
        </div>
      )}
    </div>
  );
};
