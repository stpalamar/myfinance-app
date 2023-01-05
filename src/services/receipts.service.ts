import { AxiosInstance } from 'axios';

const API_URL = '/Receipts';

export const getReceiptByTransactionId = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  transactionId: string
) => {
  const response = await axiosPrivate.get(API_URL + '/' + transactionId, {
    signal: controller.signal,
  });
  return response.data;
};
