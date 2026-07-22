export interface DailyBoxOfficeItem {
  rnum: string;
  rank: string;
  rankInten: string;
  rankOldAndNew: 'OLD' | 'NEW';
  movieCd: string;
  movieNm: string;
  openDt: string;
  salesAmt: string;
  salesShare: string;
  salesInten: string;
  salesChange: string;
  salesAcc: string;
  audiCnt: string;
  audiInten: string;
  audiChange: string;
  audiAcc: string;
  scrnCnt: string;
  showCnt: string;
}

export interface KOBISBoxOfficeResponse {
  boxOfficeResult: {
    boxofficeType: string;
    showRange: string;
    dailyBoxOfficeList: DailyBoxOfficeItem[];
  };
}

export interface MovieActor {
  peopleNm: string;
  peopleNmEn: string;
  cast: string;
  castEn?: string;
}

export interface MovieDirector {
  peopleNm: string;
  peopleNmEn: string;
}

export interface MovieNation {
  nationNm: string;
}

export interface MovieGenre {
  genreNm: string;
}

export interface MovieCompany {
  companyCd: string;
  companyNm: string;
  companyNmEn: string;
  companyPartNm: string;
}

export interface MovieAudit {
  auditNo: string;
  watchGradeNm: string;
}

export interface MovieShowType {
  showTypeGroupNm: string;
  showTypeNm: string;
}

export interface MovieDetailInfo {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg?: string;
  showTm: string;
  prdtYear: string;
  openDt: string;
  prdtStatNm: string;
  typeNm: string;
  nations: MovieNation[];
  genres: MovieGenre[];
  directors: MovieDirector[];
  actors: MovieActor[];
  showTypes: MovieShowType[];
  companys: MovieCompany[];
  audits: MovieAudit[];
  staffs?: { peopleNm: string; peopleNmEn: string; staffRoleNm: string }[];
}

export interface KOBISMovieDetailResponse {
  movieInfoResult: {
    movieInfo: MovieDetailInfo;
    source?: string;
  };
}

export interface AISummaryResponse {
  summary: string;
  highlights: string[];
  recommendedAudience: string;
  posterPrompt?: string;
}

export interface AIReviewResponse {
  headline: string;
  rating: number;
  keyPoints: string[];
  detailedReview: string;
  recommendationReason: string;
}
