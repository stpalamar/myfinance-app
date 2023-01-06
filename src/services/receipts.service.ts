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

export const deleteReceiptFromTransaction = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  transactionId: string
) => {
  const response = await axiosPrivate.delete(API_URL + '/' + transactionId, {
    signal: controller.signal,
  });
  return response.data;
};

export const addReceiptToTransaction = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  transactionId: string,
  receiptFile: any
) => {
  const response = await axiosPrivate.post(
    API_URL + '/' + transactionId,
    receiptFile,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
    }
  );
  return response.data;
};
