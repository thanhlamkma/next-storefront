export interface ListRequest {}
export interface ListResponse {}

// Create
export interface CreateRequest {
  name: string;
  street: string;
  street2?: string;
  stateId?: number;
  phone: string;
  isCompany: boolean;
  setDefault: boolean;
}

export interface CreateResponse {
  id: number;
  name: string;
  companyId: number;
  street: string;
  street2: string;
  countryId: number;
  stateId: number;
  phone: string;
  email: string;
  isCompany: boolean;
  userId: number;
  active: boolean;
  type: string;
  parentId: number;
  createDate: string;
  createUid: number;
  writeDate: string;
  writeUid: number;
}

// Update
export interface UpdateRequest {
  name: string;
  street: string | null;
  stateId?: number;
  street2?: string;
  phone?: string;
  isCompany: boolean;
  isDefault: boolean;
  id: number;
}

export interface UpdateResponse {
  id: number;
  name: string;
  companyId: number;
  street: string;
  street2: string;
  countryId: number;
  stateId: number;
  phone: string;
  email: string;
  isCompany: boolean;
  userId: number;
  active: boolean;
  type: string;
  parentId: number;
  createDate: string;
  createUid: number;
  writeDate: string;
  writeUid: number;
}

// Get one
export interface GetOneResponse {}

// Delete
export type DeleteResponse = boolean;

// Get List By User Request
export interface GetListAddressRequest {
  NameFilter?: string;
  PageSize?: number;
  PageIndex?: number;
}

export interface Address {
  id: number;
  name: string;
  street: string;
  phone: string;
  stateId: number;
  city: string;
  isDefault?: boolean;
}

export interface GetListAddressResponse {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<Address>;
}

// Get Detail Address
export interface GetDetailAddressResponse {
  id: number;
  name?: string;
  companyId?: number;
  street?: string;
  street2?: string;
  countryId?: number;
  stateId?: number;
  phone?: string;
  isCompany?: boolean;
  isDefault?: boolean;
  userId?: number;
}

// Get List By Email
export interface GetListByEmailResponse {}

// Get List Vendor
export type GetListVendorRequest = {
  pageSize?: number;
  pageIndex?: number;
};

export type GetListVendorResponse = {
  total: 0;
  pageSize: 0;
  pageIndex: 0;
  data: Array<GetDetailVendor>;
};

export type GetDetailVendor = {
  id: 0;
  name: string;
  image: string;
};
