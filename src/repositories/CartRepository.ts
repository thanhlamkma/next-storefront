import { Repository, RepositoryPath } from "src/core/Repository";
import {
  GetCartResponse,
  AddItemRequest,
  AddItemResponse,
  AddPaymentRequest,
  AddShippingRequest,
  AddCouponRequest,
  RemoveItemRequest,
} from "src/models/Carts";

class CartRepository extends Repository<any, any, any, GetCartResponse> {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_ORDER_URL);
  }

  protected paths: RepositoryPath = {
    base: "/api/cart",
    create: "",
    get: "/api/cart/get-cart",
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

  addItemIntoCart(data: AddItemRequest) {
    return this.request<AddItemResponse>({
      method: "POST",
      url: "/add-item-into-cart",
      data,
    });
  }

  repurchaseItemIntoCart(data: AddItemRequest) {
    return this.request<AddItemResponse>({
      method: "POST",
      url: "/repurchase-item-into-cart",
      data,
    });
  }

  removeItemFromCart(data: RemoveItemRequest) {
    return this.request<AddItemResponse>({
      method: "POST",
      url: `/remove-item-into-cart`,
      data,
    });
  }

  addPaymentToCart(data: AddPaymentRequest) {
    return this.request<AddItemResponse>({
      method: "POST",
      url: "/add-payment-to-cart",
      data,
    });
  }

  addShippingToCart(data: AddShippingRequest) {
    return this.request<AddItemResponse>({
      method: "POST",
      url: "/add-shipping-to-cart",
      data,
    });
  }

  addCouponToCart(data: AddCouponRequest) {
    return this.request<AddItemResponse>({
      method: "POST",
      url: "/add-coupon-to-cart",
      data,
    });
  }
}

export default new CartRepository();
