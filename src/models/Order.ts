export interface GetOrderRequest {
  partnerId?: number;
  state?: number;
  pageIndex?: number;
  pageSize?: number;
}

export type GetOrderResponse = {
  total: 11;
  pageSize: 10;
  pageIndex: 1;
  data: GetDetailOrderResponse[];
};

export type GetDetailOrderResponse = {
  id: number;
  partnerInvoiceId: number;
  partnerShippingId: number;
  priceListId: number;
  companyId: number;
  warehouseId: number;
  pickingPolicy: string;
  name: string;
  orderDate: string;
  state: string;
  invoiceStatus: string;
  amountUntaxed: number;
  amountTax: number;
  amountTotal: number;
  orderLines: [
    {
      id: number;
      productTemplateId: number;
      name: string;
      orderId: number;
      productId: number;
      priceUnit: number;
      productUomQty: number;
      priceSubTotal: number;
      invoiceStatus: string;
      state: string;
      createDate: string;
      createUid: number;
      currencyId: number;
    }
  ];
  errors: [
    {
      productId: number;
      error: string;
    }
  ];
};

export type GetProductNotRatingRequest = {
  partnerId?: number;
  state?: number;
  saleOrderLineIds?: number[];
  pageIndex?: number;
  pageSize?: number;
};

export type ProductNotRating = {
  id: number;
  name: string;
  orderId: number;
  productTemplateId: number;
  productId: number;
  priceUnit: number;
  productUomQty: number;
  priceSubTotal: number;
  invoiceStatus: string;
  state: string;
  createDate: string;
  createUid: number;
  currencyId: number;
};

export type GetProductNotRatingResponse = {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<ProductNotRating>;
};
