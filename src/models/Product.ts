export type ListProductsResponse = {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<ProductDetailResponse>;
};

export type ListRequest = {
  pageSize?: number;
  pageIndex?: number;
};

export type ProductResponse = {
  productTmplId: string;
  name?: string;
  price: number;
  sellingPrice?: number;
  finalPrice?: number;
  category?: string;
  categoryId?: number;
  imageUrl?: string;
  point: number;
};

export type ListProductsRequest = {
  name?: string;
  productCategoryId?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  brandId?: string;
  tag?: string;
  pageSize?: number;
  pageIndex?: number;
};

export type ListProductsBodyRequest = {
  pageSize?: number;
  pageIndex?: number;
  name?: string;
  productCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  attribuleFilterInputs?: [
    {
      attributeId?: number;
      attributeValueIds?: number[];
    }
  ];
};

export interface ProductDetailResponse {
  id: string;
  name: string;
  price: number;
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
  barcode: string;
  sellingPrice: number;
  category: string;
  producer: string;
  finalPrice: number;
  categoryOdooId: number;
  point: number;
  agentPoint: number;
  odooId: string;
  productTmplId: number;
  code: string;
  categoryId: number;
  discountId: number;
  qrCodes: string[];
  unit: string;
  description: string;
  details: string;
  status: string;
  imageUrl: string;
  images: string[];
  photos: [
    {
      id: string;
      url: string;
      isMain: boolean;
      isDeleted: boolean;
      isArchived: boolean;
    }
  ];
  attributes: string[];
  attributeProduct: number[];
  attributeIds: number[];
  attributeNames: string[];
  attributeValues: string[];
  barcodes: string[];
  accumulatedPoints: [
    {
      point: number;
      applyFor: string;
    }
  ];
  alternativeProducts: string;
  productCategoryOdoo: {
    categoryId: number;
    name: string;
    parentPath: string;
  };
  productProducerOdoo: {
    producerId: number;
    name: string;
  };
  attributesOdoosLst: [
    {
      attributeId: number;
      name: string;
      value: [{
        _id: string,
        Name: string;
      }];
    }
  ];
  productImageOdoo: [
    {
      _id: 0;
      image: string;
    }
  ];
  qtyAvailable: number;
  isFavourite: boolean;
}

// Attribute of Product
export interface ListAttributeProductRequest {
  productId: number[];
}

export interface ListAttributeProductResponse {
  productTemplateId: number;
  attributeInfo: AttributeInfoResponse[];
  productIds: AttributeProductResponse[];
}

export type AttributeInfoResponse = {
  attributeId: number;
  name: string;
  displayType: string;
  value: AttributeValueResponse[];
};

export type AttributeProductResponse = {
  productId: number;
  attributes: [
    {
      attributeId: number;
      name: string;
      displayType: string;
      value: AttributeValueResponse;
    }
  ];
};

// Attribute Filter
export interface AttributeFilterResponse {
  id: number;
  name: string;
  values: AttributeValueResponse[];
}

export type AttributeValueResponse = {
  id: number;
  name: string;
  sequence: number;
  attributeId: number;
  isCustom: boolean;
  htmlColor: string;
  color: number;
  createUid: number;
  createDate: string;
  writeUid: number;
  writeDate: string;
};

// Attribute Filter 2
export type GetAttributeFilterRequest = {
  categoryId?: string;
  name?: string;
};

export type GetAttributeFilterResponse = {
  _id: {
    id: number;
    name: string;
  };
  attributeValues: [
    {
      _id: string;
      name: string;
    }
  ];
};

export type GetListAttributeFilterResponse = GetAttributeFilterResponse[];

// Category of Product
export type ProductCategory = {
  id: number;
  name: string;
  parentId: number | null;
};

export type ProductCategory2 = {
  id: number;
  name: string;
  completeName: string;
  parentId: number | null;
  parentPath: string;
  createUid: number;
  createDate: string;
  writeUid: number;
  writeDate: string;
  removalStrategyId: number;
  packagingReserveMethod: string;
};

// Rating Product
export interface ProductRatingRequest {
  productId: string | number;
  saleOrderLineId?: number;
  description: string;
  images: string[];
  rating: number;
}

export type ListRatingProductsResponse = {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<RatingProductResponse>;
};

export interface RatingProductResponse {
  id: string;
  key: string;
  productId: number;
  productName: string;
  productImage: [
    {
      _id: 0;
      image: "string";
    }
  ];
  userId: number;
  userName: string;
  description: string;
  rating: number;
  like: number;
  userIds: number[];
  images: string[];
  comment: CommentRatingResponse[];
}

export type GetAllRatingByUserResponse = {
  saleOrderLineId: number[];
};

// Feedaback
export interface CommentRatingResponse {
  userId?: number;
  userName?: string | undefined;
  createDate: string;
  description?: string | any;
}

export interface CountStarRatingResponse {
  productId: number;
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  total: number;
  average: number;
}

export type ListCountStarRatingRequest = {
  productId: number[];
};

export type ListCountStarRatingResponse = CountStarRatingResponse[];

export type ListIdAccountProductsResponse = {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: number[];
};

export type ListProductByIdResquest = {
  productTmplId: number[];
  sort?: string;
};

export type ListProductByIdResponse = ProductResponse[];

export type LikeRatingRequest = {
  key: string;
};

export type CommentRatingRequest = {
  key: string;
  description: string;
};

// Favourite Product
export interface FavouriteProductRequest {
  productTemplateId?: number;
  isFavourite?: boolean;
}

// Relative Product
export interface RelativeProductResquest {
  productTmplId: number;
  skip?: number;
  take?: number;
}

export interface RelativeProductResponse {
  name: string;
  price: number;
  finalPrice: number;
  productTmplId: number;
  code?: string;
  categoryId: number;
  status: string;
  imageUrl?: string;
  images?: string[];
  photos?: [
    {
      id: string;
      url: string;
      isMain: true;
      isDeleted: true;
      isArchived: true;
    }
  ];
  productCategoryOdoo: {
    categoryId: number;
    name?: string;
    parentPath?: string;
  };
  qtyAvailable: number;
  isFavourite: boolean;
}

export type ListRelativeProductResponse = RelativeProductResponse[];

// Get image by productTemplateId
export type GetImagesByProductTmpRequest = {
  productTmplId: number[];
};

export type GetImagesByProductTmpResponse = {
  productTmplId: number;
  odooId: string;
  productImageOdoo: [
    {
      _id: number;
      image: string;
    }
  ];
};

// Update quantity available
export type UpdateQuantityRequest = {
  productTmplId: number;
  qtyAvailable: number;
};

export type UpdateListQuantityRequest = {
  productInfo: UpdateQuantityRequest[];
};
