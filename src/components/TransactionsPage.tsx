import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getTransactions } from '../services/transactions.service';

import useRefreshToken from '../hooks/useRefreshToken';

import TransactionsList from './transactionsPage/TransactionsList';

import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const TransactionsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    const fetchTransctions = async () => {
      try {
        const response = await getTransactions(axiosPrivate, controller);
        setLoading(false);
        setTransactions(response);
      } catch (err) {
        setErrMessage('Error fetching transactions');
        setLoading(false);
        navigate('/login', { replace: true });
      }
    };
    fetchTransctions();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {loading ? (
        <Spinner animation="border"></Spinner>
      ) : errMessage ? (
        <Alert variant="danger">{errMessage}</Alert>
      ) : (
        <TransactionsList list={transactions} />
      )}
    </>
  );
};

export default TransactionsPage;
