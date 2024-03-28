export interface GetCouponsRequest {
  couponProgramId?: number;
  couponCode?: string;
  userId?: number;
  pageSize?: number;
  pageIndex?: number;
}

export interface GetCouponsResponse {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: GetCouponDetailResponse[];
}

export type GetCouponDetailResponse = {
  id: number;
  name: string;
  code: string;
  state: string;
  isSave: boolean;
  expiredDate: string;
};

