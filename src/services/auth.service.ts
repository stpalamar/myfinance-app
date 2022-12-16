import axios from '../api/axios';

const API_URL = '/Authentication';

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const response = await axios.post(
    API_URL + '/signup',
    {
      firstName,
      lastName,
      email,
      password,
    },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  );
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    API_URL + '/signin',
    {
      email,
      password,
    },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  );
  return response.data;
};
