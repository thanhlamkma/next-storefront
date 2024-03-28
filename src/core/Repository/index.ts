import { Api } from "src/core/api";
import { ApiRequestConfig } from "src/core/models/api";

export interface RepositoryPath {
  /**
   * Base path to join with url passed to Repository.request method
   */
  base: string;
  /**
   * Create request's path url for repository
   */
  create?: string;
  /**
   * Get list request's path url for repository
   */
  get?: string;
  /**
   * Update request's path url for repository
   */
  update?: (id: string | number) => string;
  /**
   * Delete request's path url for repository
   */
  delete?: (id: string | number) => string;
  /**
   * Get one request's path url for repository
   */
  getOne?: (id: string | number) => string;
}

export abstract class Repository<
  ListRequest = any,
  CreateRequest = any,
  UpdateRequest = any,
  ListResponse = any,
  GetOneResponse = any,
  CreateResponse = any,
  UpdateResponse = any,
  DeleteResponse = any
> {
  protected apiUrl: string;
  protected api: Api;
  protected paths: RepositoryPath = {
    base: "",
    create: "",
    get: "",
    update: () => "",
    delete: () => "",
    getOne: () => "",
  };

  constructor(apiUrl?: string, tokenType?: TokenTypes | null) {
    this.apiUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL;
    this.api = new Api(this.apiUrl);
    if (typeof tokenType !== "undefined") {
      this.api.setAuthorizationTokenType(tokenType);
    }
  }

  public create(data: CreateRequest) {
    return this.api.post<CreateResponse>(
      this.paths.create || this.paths.base,
      data
    );
  }

  public update(id: string | number, data: UpdateRequest) {
    return this.api.put<UpdateResponse>(
      (this.paths.update && this.paths.update(id)) || this.paths.base,
      data
    );
  }

  public multipartCreate(data: CreateRequest) {
    return this.api.post<CreateResponse>(
      this.paths.create || this.paths.base,
      data,
      {
        contentType: "formData",
      }
    );
  }

  public multipartUpdate(id: string | number, data: UpdateRequest) {
    return this.api.put<UpdateResponse>(
      (this.paths.update && this.paths.update(id)) || this.paths.base,
      data,
      {
        contentType: "formData",
      }
    );
  }

  public getOne(id: number | string) {
    return this.api.get<GetOneResponse>(
      (this.paths.getOne && this.paths.getOne(id)) || this.paths.base
    );
  }

  public get(params?: ListRequest) {
    return this.api.get<ListResponse>(
      this.paths.get || this.paths.base,
      params
    );
  }

  public delete(id: number | string) {
    return this.api.delete<DeleteResponse>(
      (this.paths.delete && this.paths.delete(id)) || this.paths.base
    );
  }

  public request<Response = any>(config: ApiRequestConfig) {
    return this.api.request<Response>({
      ...config,
      url: this.paths.base + config.url,
    });
  }
}
