import { AxiosInstance } from 'axios';

import Deposit from '../types/Deposit.type';

const API_URL = '/Deposits';

export const getDeposits = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController
) => {
  const response = await axiosPrivate.get(API_URL, {
    signal: controller.signal,
  });
  return response.data;
};

export const addDeposit = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  deposit: Deposit
) => {
  const response = await axiosPrivate.post(API_URL, deposit, {
    signal: controller.signal,
  });
  return response.data;
};

export const updateDeposit = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  deposit: Deposit
) => {
  const response = await axiosPrivate.put(API_URL, deposit, {
    signal: controller.signal,
  });
  return response.data;
};

export const deleteDeposit = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  depositId: string
) => {
  await axiosPrivate.delete(API_URL + '/' + depositId, {
    signal: controller.signal,
  });
  return true;
};
