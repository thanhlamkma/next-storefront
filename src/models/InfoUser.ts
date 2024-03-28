export interface ListRequest {}
export interface CreateRequest {}
export interface UpdateRequest {
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: Date | string;
  countryId?: number;
  isUpdateEmail?: boolean;
  isUpdatePhone?: boolean;
  image?: {
    name: string;
    mimeType: string;
    url: string;
  };
}

export type UpdateResponse = boolean;
export interface ListResponse {
  name?: string;
  nickName?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: Date | string;
  countryId?: number;
  avatar?: string;
}

export interface GetOneResponse {}
export interface CreateResponse {}
export interface DeleteResponse {}

export interface GetBaseProfileResponse {
  name: string;
  nickName: string;
  userId: number;
  avatar: string;
}
