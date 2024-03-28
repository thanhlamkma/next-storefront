import { Repository, RepositoryPath } from "src/core/Repository";
import {
  GetListBannerRequest,
  GetListBannerResponse,
} from "src/models/Banner";

class BannerRepository extends Repository<
  GetListBannerRequest,
  any,
  any,
  GetListBannerResponse
> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_PRODUCT_URL);
  }
  protected paths: RepositoryPath = {
    base: "/api/banner",
    create: "",
    get: "/api/banner/get-list",
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
}

export default new BannerRepository();
