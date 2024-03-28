export type FileUploadRequest = {
  infos?: string;
  uploadType: string;
  files: any;
}

export type FileUploadResponse = {
  name: string;
  mimeType: string;
  url: string;
};

