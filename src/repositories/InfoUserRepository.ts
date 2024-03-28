import { Repository, RepositoryPath } from "src/core/Repository";
import {
  CreateRequest,
  CreateResponse,
  DeleteResponse,
  GetBaseProfileResponse,
  GetOneResponse,
  ListRequest,
  ListResponse,
  UpdateRequest,
  UpdateResponse,
} from "src/models/InfoUser";

class InfoUserRepository extends Repository<
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
    base: "/api/user",
    create: "",
    get: "/api/user/profile",
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

  public updateProfileUser(data: UpdateRequest) {
    return this.request<UpdateResponse>({
      method: "put",
      url: "/update-profile",
      data,
    });
  }

  public getBaseProfile() {
    return this.request<GetBaseProfileResponse>({
      method: "get",
      url: "/base-profile",
    });
  }
}

export default new InfoUserRepository();
