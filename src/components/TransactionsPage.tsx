import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getTransactions } from '../services/transactions.service';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import TransactionsList from './transactionsPage/TransactionsList';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

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
        <LoadingSpinnerCenter />
      ) : errMessage ? (
        <Alert variant="danger">{errMessage}</Alert>
      ) : (
        <>
          <Container className="d-flex my-4 justify-content-center">
            Sorting features...
          </Container>
          <TransactionsList list={transactions} />
        </>
      )}
    </>
  );
};

export default TransactionsPage;
