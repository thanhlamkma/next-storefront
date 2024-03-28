import { Repository, RepositoryPath } from "src/core/Repository";
import { ListRequest, ListIdAccountProductsResponse } from "src/models/Product";

class BuyLaterProductRepository extends Repository<
  ListRequest,
  any,
  any,
  ListIdAccountProductsResponse
> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_PRODUCT_URL);
  }
  protected paths: RepositoryPath = {
    base: "/api/productsbuylater",
    create: "",
    get: "/api/productsbuylater/get-list-productsbuylater",
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

  addBuyLaterProduct(productTemplateId: number) {
    return this.request({
      method: "POST",
      url: `/add-productsbuylater`,
      params: {
        productTemplateId,
      },
    });
  }

  removeBuyLaterProduct(productTemplateId: number) {
    return this.request({
      method: "DELETE",
      url: "/remove-productsbuylater",
      params: {
        productTemplateId,
      },
    });
  }
}

export default new BuyLaterProductRepository();
