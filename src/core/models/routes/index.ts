export interface IRoute {
  path: string;
  documentTitle?: string;
  pageTitle?: string;
  routes?: IRoute[];
  permissions?: string | string[];
}
