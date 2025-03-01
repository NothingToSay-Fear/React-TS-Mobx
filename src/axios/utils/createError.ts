import { AxiosError, AxiosRequestConfig } from "axios";

type NewAxiosError = Omit<AxiosError, "config"> & {
  config: AxiosRequestConfig;
};

export const createError = (
  message: string,
  config: AxiosRequestConfig,
): NewAxiosError => {
  return {
    name: "custom error",
    message,
    config,
    isAxiosError: false,
    toJSON: () => ({
      message,
      config,
    }),
  };
};
