import { Repository, RepositoryPath } from "src/core/Repository";
import {
  CreateRequest,
  CreateResponse,
  DeleteResponse,
  GetDetailAddressResponse,
  GetListAddressRequest,
  GetListAddressResponse,
  GetListByEmailResponse,
  GetListVendorRequest,
  GetListVendorResponse,
  GetOneResponse,
  ListRequest,
  ListResponse,
  UpdateRequest,
  UpdateResponse,
} from "src/models/Partner";

class PartnerRepository extends Repository<
  ListRequest,
  CreateRequest,
  UpdateRequest,
  ListResponse,
  GetOneResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse
> {
  protected paths: RepositoryPath = {
    base: "/api/partner",
    create: "/api/partner/create-address",
    get: "",
    update(id: string | number) {
      return `${this.base}/update-address`;
    },
    delete(id: string | number) {
      return `${this.base}/delete-address?id=${id}`;
    },
  };

  constructor() {
    super(process.env.NEXT_PUBLIC_API_CUSTOMER_URL);
  }

  public getListAddress(params: GetListAddressRequest) {
    return this.request<GetListAddressResponse>({
      method: "GET",
      url: "/get-list-address",
      params,
    });
  }

  public getDetailAddress(id: number) {
    return this.request<GetDetailAddressResponse>({
      method: "GET",
      url: "/get-detail-address",
      params: {
        id,
      },
    });
  }

  public getListByEmail(email: string) {
    return this.request<GetListByEmailResponse>({
      method: "GET",
      url: "/list-by-email",
      params: {
        email,
      },
    });
  }

  public getVendorDetail(id: number) {
    return this.request<CreateResponse>({
      method: "GET",
      url: `/get-detail?id=${id}`
    })
  }

  public getListVendor(params: GetListVendorRequest) {
    return this.request<GetListVendorResponse>({
      method: "GET",
      url: "/get-list-vendor",
      params
    })
  }
}

export default new PartnerRepository();
