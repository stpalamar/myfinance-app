import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect((): any => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        setIsLoading(true);
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    // console.log(`isLoading: ${isLoading}`);
    // console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <LoadingSpinnerCenter />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
