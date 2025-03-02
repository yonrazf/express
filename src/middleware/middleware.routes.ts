import axios from "axios";
import { Request } from "express";

export interface IRoutesConfig {
  vendorClientPublicRoutes: Array<{
    method: string;
    url: string;
    description?: string;
    withQueryParams?: Array<{
      key: string;
      value?: string;
    }>;
  }>;
}

class FronteggRoutes {
  private routesConfig: undefined | IRoutesConfig;

  constructor(private baseUrl: string) {}

  public async getRoutesConfig() {
    if (!this.routesConfig) {
      this.routesConfig = await this.fetchRoutesConfig();
    }

    return this.routesConfig;
  }

  public async isFronteggPublicRoute(req: Request) {
    const { vendorClientPublicRoutes } = await this.getRoutesConfig();
    return vendorClientPublicRoutes.some((route) => {
      const path = req.path.replace("/", "");
      if (path !== route.url) {
        return false;
      }
      if (req.method.toUpperCase() !== route.method.toUpperCase()) {
        return false;
      }
      if (route.withQueryParams) {
        const hasAllQueryParams = route.withQueryParams.every(
          ({ key, value }) => {
            const queryParamValue = req.query[key];
            return queryParamValue && (!value || queryParamValue === value);
          }
        );
        if (!hasAllQueryParams) {
          return false;
        }
      }

      return true;
    });
  }

  private async fetchRoutesConfig(): Promise<IRoutesConfig> {
    const response = await axios.get(`${this.baseUrl}/configs/routes`);

    return response.data as IRoutesConfig;
  }
}

export const fronteggRoutesHelper = new FronteggRoutes(
  "https://api.frontegg.com"
);
