export interface ListRequest {
  CodeFilter?: string;
  NameFilter?: string;
  PageSize?: number;
  PageIndex?: number;
}

export interface ItemResponse {
  id: number;
  code: string;
  name: string;
}

export interface ListCountryResponse {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<ItemResponse>;
}

export interface ListStateResponse {
  total: number;
  pageSize: number;
  pageIndex: number;
  data: Array<ItemResponse>;
}

export interface DetailStateResponse {
  id: number;
  countryId: number;
  name: string;
  code: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "Other",
}
