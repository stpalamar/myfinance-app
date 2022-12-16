import { AxiosInstance } from 'axios';

import Account from '../types/Account.type';

const API_URL = '/Accounts';

export const getAccounts = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController
) => {
  const response = await axiosPrivate.get(API_URL, {
    signal: controller.signal,
  });
  return response.data;
};

export const addAccount = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  account: Account
) => {
  const response = await axiosPrivate.post(API_URL, account, {
    signal: controller.signal,
  });
  return response.data;
};

export const deleteAccount = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  accountId: string
) => {
  await axiosPrivate.delete(API_URL + '/' + accountId, {
    signal: controller.signal,
  });
  return true;
};

export const updateAccount = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  account: Account
) => {
  const response = await axiosPrivate.put(API_URL, account, {
    signal: controller.signal,
  });
  return response.data;
};
