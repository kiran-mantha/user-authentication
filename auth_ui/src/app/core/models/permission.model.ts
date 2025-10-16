export interface Permission {
  id: number;
  name: string;
  codename: string;
  description: string;
  api_endpoint?: string;
  http_method?: string;
}

export interface PermissionCreate {
  name: string;
  codename: string;
  description: string;
  api_endpoint?: string;
  http_method?: string;
}

export interface PermissionUpdate {
  name?: string;
  codename?: string;
  description?: string;
  api_endpoint?: string;
  http_method?: string;
}