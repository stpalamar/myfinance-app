import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/Authentication/refresh', {
      withCredentials: true,
    });
    setAuth((prev: any) => {
      // console.log(response.data.accessToken);
      return {
        ...prev,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
