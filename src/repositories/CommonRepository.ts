import { Repository, RepositoryPath } from "src/core/Repository";
import {
  DetailStateResponse,
  ItemResponse,
  ListCountryResponse,
  ListRequest,
  ListStateResponse,
} from "src/models/Common";

class CommonRepository extends Repository {
  protected paths: RepositoryPath = {
    base: "",
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

  constructor() {
    super(process.env.NEXT_PUBLIC_API_CUSTOMER_URL);
  }

  public getListCountry(params: ListRequest) {
    return this.request<ListCountryResponse>({
      method: "get",
      url: "/api/country/get-list",
      params,
    });
  }

  public getDetailCountry(id: number) {
    return this.request<ItemResponse>({
      method: "get",
      url: "api/country/get-detail",
      params: {
        id,
      },
    });
  }

  public getListState(params: ListRequest) {
    return this.request<ListStateResponse>({
      method: "get",
      url: "/api/state/get-list",
      params,
    });
  }

  public getDetailState(id: number) {
    return this.request<DetailStateResponse>({
      method: "get",
      url: "api/state/get-detail",
      params: {
        id,
      },
    });
  }
}

export default new CommonRepository();
