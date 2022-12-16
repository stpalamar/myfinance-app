import { AxiosInstance } from 'axios';

const API_URL = '/ImportExport';

export const exportTransactions = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController
) => {
  const response = await axiosPrivate.get(API_URL, {
    signal: controller.signal,
    responseType: 'blob',
  });
  console.log(response);
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Transactions ${new Date(Date.now()).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })}.xlsx`
  );
  document.body.appendChild(link);
  link.click();
};

export const importTransactions = async (
  axiosPrivate: AxiosInstance,
  controller: AbortController,
  fileExcel: any
) => {
  console.log(fileExcel);
  const response = await axiosPrivate.post(API_URL, fileExcel, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal: controller.signal,
  });
  console.log(response);
};
