import { Repository, RepositoryPath } from "src/core/Repository";
import {
  FavouriteProductRequest,
  ListRequest,
  ListIdAccountProductsResponse,
} from "src/models/Product";

class FavouriteProductRepository extends Repository<
  ListRequest,
  any,
  any,
  ListIdAccountProductsResponse
> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_PRODUCT_URL);
  }

  protected paths: RepositoryPath = {
    base: "/api/favouriteProduct",
    create: "",
    get: "/api/favouriteProduct/get-list-product",
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

  getListFavouriteIds(params: ListRequest) {
    return this.request<ListIdAccountProductsResponse>({
      method: "GET",
      url: "/get-list-product",
      params,
    });
  }

  addFavouriteProduct(data: FavouriteProductRequest) {
    return this.request({
      method: "POST",
      url: `/add-or-remove`,
      data,
    });
  }

  countFavouriteProduct() {
    return this.request({
      method: "POST",
      url: `/get-count-favourite`,
    });
  }
}

export default new FavouriteProductRepository();
