import { ApiRequestConfig } from "src/core/models/api";
import { Repository, RepositoryPath } from "src/core/Repository";
import { FileUploadRequest, FileUploadResponse } from "src/models/File";

class FileRepository extends Repository {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_CDN_URL);
  }

  protected paths: RepositoryPath = {
    base: "/file",
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

  uploadImage(data: FileUploadRequest, config?: ApiRequestConfig<any>) {
    return this.api.post<FileUploadResponse[]>(
      `${this.paths.base}/upload`,
      data,
      {
        contentType: "formData",
      }
    );
  }
}

export default new FileRepository();
