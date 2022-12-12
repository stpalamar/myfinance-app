import { AxiosInstance } from 'axios';

const API_URL = '/Transactions/';

export const getTransactions = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController
) => {
  const response = await axiosPrivate.get(API_URL, {
    signal: controller.signal,
  });
  return response.data;
};
