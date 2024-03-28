import { Repository, RepositoryPath } from "src/core/Repository";
import { GetCouponsRequest, GetCouponsResponse } from "src/models/Coupon";

class CouponRepository extends Repository<GetCouponsResponse> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_ORDER_URL);
  }

  protected paths: RepositoryPath = {
    base: "/api/coupon",
    create: "",
    get: "/api/coupon/coupons",
    update(id: string | number) {
      return `${this.base}`;
    },
    delete(id: string | number) {
      return `${this.base}`;
    },
    getOne(id: string | number) {
      return `${this.base}`;
    },
  };

  getListCoupons(params?: GetCouponsRequest) {
    return this.request<GetCouponsResponse>({
      method: "GET",
      url: "/coupons",
      params,
    });
  }

  getListCouponUserSave(params?: GetCouponsRequest) {
    return this.request<GetCouponsResponse>({
      method: "GET",
      url: "/list-coupons-user-save",
    });
  }

  saveCoupon(couponId: number) {
    return this.request({
      method: "POST",
      url: "/save-coupon",
      data: {
        couponId: couponId,
      },
    });
  }
}

export default new CouponRepository();
