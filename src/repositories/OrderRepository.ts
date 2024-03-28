import { Repository, RepositoryPath } from "src/core/Repository";
import {
  GetDetailOrderResponse,
  GetOrderRequest,
  GetOrderResponse,
  GetProductNotRatingRequest,
  GetProductNotRatingResponse,
} from "src/models/Order";

class OrderRepository extends Repository<
  GetOrderRequest,
  any,
  any,
  GetOrderResponse,
  GetDetailOrderResponse,
  any,
  any,
  any
> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_ORDER_URL);
  }

  protected paths: RepositoryPath = {
    base: "/api/orders",
    create: "",
    get: "",
    update(id: string | number) {
      return `${this.base}`;
    },
    delete(id: string | number) {
      return `${this.base}`;
    },
    getOne(id: string | number) {
      return `${this.base}/${id}`;
    },
  };

  getDetailOrder(orderId: number) {
    return this.request<GetDetailOrderResponse>({
      method: "GET",
      url: `/${orderId}`,
    });
  }

  createOrder() {
    return this.request<GetDetailOrderResponse>({
      method: "POST",
      url: "",
    });
  }

  getProductNotRating(data: GetProductNotRatingRequest) {
    return this.request<GetProductNotRatingResponse>({
      method: "POST",
      url: "/product-not-rating",
      data,
    });
  }
}

export default new OrderRepository();
