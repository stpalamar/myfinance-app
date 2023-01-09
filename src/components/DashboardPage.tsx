import { useCallback, useEffect, useState } from 'react';

import { getTransactions } from '../services/transactions.service';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Transaction from '../types/Transaction.type';

import CashFlowChart from './dashboardPage/CashFlowChart';
import LastTransactions from './dashboardPage/LastTransactions';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import BalanceTrendChart from './dashboardPage/BalanceTrendChart';

const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const transactionsResponse = (await getTransactions(
        axiosPrivate,
        controller
      )) as Transaction[];
      const sortedTransactions = transactionsResponse.sort((a, b) => {
        return Date.parse(b.date) - Date.parse(a.date);
      });

      setTransactions(sortedTransactions);

      setLoading(false);
    } catch (err) {
      setErrMessage('Error fetching data');
      setLoading(false);
    }
    controller.abort();
  }, [axiosPrivate]);

  useEffect(() => {
    const controller = new AbortController();

    fetchData();
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return (
    <>
      {loading ? (
        <LoadingSpinnerCenter />
      ) : errMessage ? (
        <Alert variant="danger">{errMessage}</Alert>
      ) : (
        <Container className="mt-3">
          <div className="d-flex flex-row justify-content-between">
            <CashFlowChart transactions={transactions} />
            <LastTransactions transactions={transactions} />
            <BalanceTrendChart transactions={transactions} />
          </div>
        </Container>
      )}
    </>
  );
};

export default DashboardPage;
