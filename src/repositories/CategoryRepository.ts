import { Repository, RepositoryPath } from "src/core/Repository";
import { ProductCategory, ProductCategory2 } from "src/models/Product";

class CategoryRepository extends Repository<
  any,
  any,
  any,
  Array<ProductCategory2>
> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_PRODUCT_URL);
  }
  protected paths: RepositoryPath = {
    base: "/api/product/category",
    create: "",
    get: "/api/product/category",
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

  getListCategories() {
    return this.api.get<Array<ProductCategory>>(this.paths.base, undefined, {
      showLoading: true,
    });
  }
}

export default new CategoryRepository();
