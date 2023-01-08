import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Deposit from '../types/Deposit.type';
import { getDeposits } from '../services/deposits.service';

import DepositCalculator from './depositsPage/DepositCalculator';
import DepositsList from './depositsPage/DepositsList';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import Container from 'react-bootstrap/Container';

interface DepositsContext {
  deposits: Deposit[];
  setDeposits: (deposit: Deposit[] | any) => void;
  selectedDeposit: Deposit | null;
  setSelectedDeposit: (deposit: Deposit | any) => void;
}

export const DepositsContext = createContext<DepositsContext>({
  deposits: [],
  setDeposits: () => {},
  selectedDeposit: null,
  setSelectedDeposit: () => {},
});

const DepositsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

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
        <DepositsContext.Provider
          value={
            {
              deposits,
              setDeposits,
              selectedDeposit,
              setSelectedDeposit,
            } as any
          }
        >
          <Container className="d-flex mt-3">
            <div className="d-flex flex-fill mx-3">
              <DepositCalculator></DepositCalculator>
            </div>
            <div className="d-flex flex-fill mx-3">
              <DepositsList></DepositsList>
            </div>
          </Container>
        </DepositsContext.Provider>
      )}
    </>
  );
};

export default DepositsPage;
