import { Repository, RepositoryPath } from "src/core/Repository";
import {
  ListProductByIdResquest,
  ListProductsRequest,
  ListProductsResponse,
  AttributeFilterResponse,
  ProductDetailResponse,
  RelativeProductResquest,
  AttributeValueResponse,
  ListAttributeProductResponse,
  ListAttributeProductRequest,
  ListProductsBodyRequest,
  GetImagesByProductTmpRequest,
  GetImagesByProductTmpResponse,
  UpdateListQuantityRequest,
  GetAttributeFilterRequest,
  GetListAttributeFilterResponse,
} from "src/models/Product";

class ProductRepository extends Repository<
  ListProductsRequest,
  any,
  any,
  ListProductsResponse,
  ProductDetailResponse
> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_PRODUCT_URL);
  }

  protected paths: RepositoryPath = {
    base: "/api/product",
    create: "",
    get: "/api/product/get-list",
    update(id: string | number) {
      return `${this.base}`;
    },
    delete(id: string | number) {
      return `${this.base}`;
    },
    getOne(id: string | number) {
      return `${this.base}/get-detail?id=${id}`;
    },
  };

  getListProducts(data: ListProductsBodyRequest) {
    return this.request<ListProductsResponse>({
      method: "POST",
      url: "/get-list",
      data,
    });
  }

  getAttribute() {
    return this.request<AttributeFilterResponse[]>({
      method: "GET",
      url: "/attribute",
    });
  }

  getAttributeFilter(params: GetAttributeFilterRequest) {
    return this.request<GetListAttributeFilterResponse>({
      method: "GET",
      url: "/get-attribute-filter",
      params,
    });
  }

  getAttributeValue(id: string | number) {
    return this.request<AttributeValueResponse>({
      method: "GET",
      url: `/attribute-value?id=${id}`,
    });
  }

  getListProductByIds(data: ListProductByIdResquest) {
    return this.request<ProductDetailResponse[]>({
      method: "POST",
      url: "/get-product-by-list-id",
      data,
    });
  }

  getRelativeProduct(params: RelativeProductResquest) {
    return this.request<ProductDetailResponse[]>({
      method: "GET",
      url: "/get-relative",
      params,
    });
  }

  getAttributeByOdooid(data: ListAttributeProductRequest) {
    return this.request<ListAttributeProductResponse>({
      method: "POST",
      url: "/get-attribute-by-odooid",
      data,
    });
  }

  getImagesByProductTmpId(data: GetImagesByProductTmpRequest) {
    return this.request<GetImagesByProductTmpResponse[]>({
      method: "POST",
      url: "/get-list-image-by-productTmplId",
      data,
    });
  }

  updateQuantityAvailable(data: UpdateListQuantityRequest) {
    return this.request<boolean>({
      method: "POST",
      url: "/update-quantity-available",
      data,
    });
  }
}

export default new ProductRepository();
