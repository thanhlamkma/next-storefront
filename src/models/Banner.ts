export interface GetListBannerRequest {
  startDate?: string;
  endDate?: string;
  pageIndex?: number;
  PageSize?: number;
}

export interface GetListBannerResponse {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<DetailBannerResponse>;
}

export type DetailBannerResponse = {
  id: number;
  categoryId: number;
  content: string;
  position: number;
  startDate: string;
  endDate: string;
  createDate: string;
};
