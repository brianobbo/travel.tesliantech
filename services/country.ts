import { DefaultResponse, Paginate, ParamsType, Country } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const countryService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Country>>(buildUrlQueryParams("v1/rest/countries", params)),
  get: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Country>>(buildUrlQueryParams(`v1/rest/countries/${id}`, params)),
};
