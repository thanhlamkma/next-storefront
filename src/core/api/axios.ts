import { AxiosObservable } from "src/core/api/AxiosObservable";
import env from "src/core/env";

export default function createAxiosInstance(url?: string): AxiosObservable {
  return AxiosObservable.create({
    baseURL: url || env.NEXT_PUBLIC_API_URL,
  });
}
