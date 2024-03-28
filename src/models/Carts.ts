export interface GetCartResponse {
  key: string;
  userId: number;
  amountTotal: number;
  amountUntax: number;
  amountTax: number;
  currencyId: number;
  partnerId: number;
  partnerInvoiceId: number;
  cartItems: CartItemResponse[];
  cartShipping: {
    deliveryCarrierAmount: number;
    deliveryOption: string;
    partnerShippingId: number;
    transport: string;
  };
  cartPayment: {
    paymentAcquirerId: number;
    amount: number;
  };
  cartCoupon: {
    couponCode: string;
    couponProgramId: number;
    couponFee: number;
  };
}

export type CartItemResponse = {
  productTemplateId: number;
  productId: number;
  name: string;
  productUomQty: number;
  priceUnit: number;
  priceTax: number;
  currencyId: number;
  priceSubTotal: number;
  priceSubTotalUntax: number;
  image: string;
};

// Add item into cart --- Repurchase
export type AddItemRequest = {
  productTemplateId?: number;
  productId?: number;
  name?: string;
  productUomQty?: number;
  priceUnit?: number;
  image?: string;
  qtyAvailable?: number;
};

export interface AddItemResponse {
  userCart: GetCartResponse;
  errors: [
    {
      productId: number;
      error: string;
    }
  ];
}

// Remove item from cart: Response = AddItemResponse
export type RemoveItemRequest = {
  productIds: number[];
}

// Add payment to cart: AddPaymentResponse = AddItemResponse
export type AddPaymentRequest = {
  paymentAcquirerId: number;
  amount: number;
};

// Add shiping to cart: AddShipingResponse = AddItemResponse
export type AddShippingRequest = {
  partnerShippingId: number;
  deliverOption: string;
};

// Add coupon to cart: AddCouponResponse = AddItemResponse
export type AddCouponRequest = {
  couponCode: string;
  isAdd: boolean;
};
