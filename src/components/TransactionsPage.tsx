import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getTransactions } from '../services/transactions.service';
import { getAccounts } from '../services/accounts.service';

import Transaction from '../types/Transaction.type';
import Account from '../types/Account.type';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import TransactionsList from './transactionsPage/TransactionsList';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const TransactionsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-DESC');

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    const fetchTransctions = async () => {
      try {
        const response = (await getTransactions(
          axiosPrivate,
          controller
        )) as Transaction[];
        setLoading(false);
        response.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        setTransactions(response);
      } catch (err) {
        setErrMessage('Error fetching transactions');
        setLoading(false);
        navigate('/login', { replace: true });
      }
    };
    fetchTransctions();

    // const fetchAccounts = async () => {
    //   try {
    //     const response = (await getAccounts(
    //       axiosPrivate,
    //       controller
    //     )) as Account[];
    //     setAccounts(response);
    //   } catch (err) {
    //     setErrMessage('Error fetching accounts');
    //     setLoading(false);
    //     navigate('/login', { replace: true });
    //   }
    // };
    // fetchAccounts();

    return () => {
      controller.abort();
    };
  }, []);

  const handleSelectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    const [sort, order] = e.target.value.split('-');
    const sortedTransactions = [...transactions] as Transaction[];

    if (sort === 'date') {
      sortedTransactions.sort((a, b) => {
        if (order === 'ASC') {
          return Date.parse(a.date) - Date.parse(b.date);
        } else {
          return Date.parse(b.date) - Date.parse(a.date);
        }
      });
    } else if (sort === 'amount') {
      sortedTransactions.sort((a, b) => {
        if (order === 'ASC') {
          return a.amount - b.amount;
        } else {
          return b.amount - a.amount;
        }
      });
    }
    setTransactions(sortedTransactions);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinnerCenter />
      ) : errMessage ? (
        <Alert variant="danger">{errMessage}</Alert>
      ) : (
        <>
          <Container className="d-flex my-4 justify-content-center">
            <div className="d-flex ms-auto">
              <Form.Select onChange={handleSelectSort} value={sortBy}>
                <option value="date-DESC">Time (newest first)</option>
                <option value="date-ASC">Time (olders first)</option>
                <option value="amount-ASC">Amount (lowest first)</option>
                <option value="amount-DESC">Amount (highest first)</option>
              </Form.Select>
            </div>
          </Container>
          <TransactionsList
            transactions={transactions}
            accounts={accounts}
            sortBy={sortBy}
          />
        </>
      )}
    </>
  );
};

export default TransactionsPage;
