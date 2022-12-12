import axios from '../api/axios';
import useAuth from './useAuth';

import { Auth } from '../context/AuthProvider';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/Authentication/refresh', {
      withCredentials: true,
    });
    setAuth((prev: any) => {
      // console.log(JSON.stringify(prev));
      // console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken } as Auth;
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
