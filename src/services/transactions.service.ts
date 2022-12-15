import { AxiosInstance } from 'axios';

import Transaction from '../types/Transaction.type';

const API_URL = '/Transactions';

export const getTransactions = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController
) => {
  const response = await axiosPrivate.get(API_URL, {
    signal: controller.signal,
  });
  return response.data;
};

export const addTransaction = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  transaction: Transaction
) => {
  const response = await axiosPrivate.post(API_URL, transaction, {
    signal: controller.signal,
  });
  return response.data;
};

export const updateTransaction = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  transaction: Transaction
) => {
  const response = await axiosPrivate.put(API_URL, transaction, {
    signal: controller.signal,
  });
  return response.data;
};

export const deleteTransaction = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  transactionId: string
) => {
  await axiosPrivate.delete(API_URL + '/' + transactionId, {
    signal: controller.signal,
  });
  return true;
};
