import { Repository, RepositoryPath } from "src/core/Repository";
import {
  CommentRatingRequest,
  GetAllRatingByUserResponse,
  LikeRatingRequest,
  ListCountStarRatingRequest,
  ListCountStarRatingResponse,
  ListRatingProductsResponse,
  ListRequest,
  ProductRatingRequest,
} from "src/models/Product";

class RatingProductRepository extends Repository {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_PRODUCT_URL);
  }

  protected paths: RepositoryPath = {
    base: "/api/product-rating",
    create: "",
    get: "",
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

  getListByProduct(id: number, params?: ListRequest) {
    return this.request<ListRatingProductsResponse>({
      method: "GET",
      url: `/list-by-product?ProductId=${id}`,
      params,
    });
  }

  getListByUser(params: ListRequest) {
    return this.request<ListRatingProductsResponse>({
      method: "GET",
      url: `/list-by-user`,
      params,
    });
  }

  countStarRating(data: ListCountStarRatingRequest) {
    return this.request<ListCountStarRatingResponse>({
      method: "POST",
      url: `/count-star-rating`,
      data,
    });
  }

  addRatingProduct(data: ProductRatingRequest) {
    return this.request({
      method: "POST",
      url: `/create`,
      data,
    });
  }

  getListCountStarRating(data: ListCountStarRatingRequest) {
    return this.request<ListCountStarRatingResponse>({
      method: "POST",
      url: `/count-star-rating`,
      data,
    });
  }

  addLikeRating(data: LikeRatingRequest) {
    return this.request({
      method: "POST",
      url: "/like",
      data,
    });
  }

  addCommentRating(data: CommentRatingRequest) {
    return this.request({
      method: "POST",
      url: "/comment",
      data,
    });
  }

  getAllRatingByUser() {
    return this.request<number[]>({
      method: "GET",
      url: "/get-all-by-user",
    });
  }
}

export default new RatingProductRepository();
