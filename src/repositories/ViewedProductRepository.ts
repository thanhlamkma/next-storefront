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
    base: "/api/viewedproducts",
    create: "",
    get: "/api/viewedproducts/get-list-viewedproducts",
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

  addViewedProduct(productTemplateId: number) {
    return this.request({
      method: "POST",
      url: `/add-viewedproducts`,
      params: {
        productTemplateId
      },
    });
  }

}

export default new FavouriteProductRepository();
