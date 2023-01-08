import { useState, useEffect, useCallback } from 'react';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Deposit from '../types/Deposit.type';
import { getDeposits } from '../services/deposits.service';

import DepositCalculator from './depositsPage/DepositCalculator';
import DepositsList from './depositsPage/DepositsList';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import Container from 'react-bootstrap/Container';

const DepositsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const axiosPrivate = useAxiosPrivate();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const depositsResponse = (await getDeposits(
        axiosPrivate,
        controller
      )) as Deposit[];

      setDeposits(depositsResponse);

      setLoading(false);
    } catch (err) {
      setErrMessage('Error fetching data');
      setLoading(false);
    }
    controller.abort();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinnerCenter />
      ) : (
        <Container className="d-flex mt-3">
          <div className="d-flex flex-fill mx-3">
            <DepositCalculator></DepositCalculator>
          </div>
          <div className="d-flex flex-fill mx-3">
            <DepositsList deposits={deposits}></DepositsList>
          </div>
        </Container>
      )}
    </>
  );
};

export default DepositsPage;
