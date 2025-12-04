// 중고서점 데이터 타입
export interface Bookstore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  phone?: string;
  openTime?: string;
  closeTime?: string;
  closedDays?: string;
  description?: string;
  isUserAdded?: boolean; // 사용자가 추가한 서점인지
  createdBy?: string; // 추가한 사용자 ID
  createdAt?: Date;
}

// 공공 API 응답 타입
export interface ApiBookstore {
  ESNTL_ID: string;
  FCLTY_NM: string;
  FCLTY_ROAD_NM_ADDR: string;
  FCLTY_LA: string;
  FCLTY_LO: string;
  LCLAS_NM: string;
  MLSFC_NM: string;
  TEL_NO?: string;
  WORKDAY_OPN_BSNS_TIME?: string;
  WORKDAY_CLOS_TIME?: string;
  RSTDE_GUID_CN?: string;
  OPTN_DC?: string;
  ADIT_DC?: string;
}

// 사용자 타입
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}
