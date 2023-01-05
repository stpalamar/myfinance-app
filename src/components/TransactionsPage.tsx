import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getTransactions } from '../services/transactions.service';
import { getAccounts } from '../services/accounts.service';
import { exportTransactions } from '../services/importExport.service';

import Transaction from '../types/Transaction.type';
import Account from '../types/Account.type';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import TransactionsList from './transactionsPage/TransactionsList';
import TransactionEditModal from './transactionsPage/TransactionEditModal';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const TransactionsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-DESC');
  const [editModalShow, setEditModalShow] = useState(false);

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const transactionsResponse = (await getTransactions(
        axiosPrivate,
        controller
      )) as Transaction[];
      setSortBy('date-DESC');
      const sortedTransactions = sortTransactions(
        transactionsResponse,
        'date-DESC'
      );

      const accountsResponse = (await getAccounts(
        axiosPrivate,
        controller
      )) as Account[];

      setAccounts(accountsResponse);
      setTransactions(sortedTransactions);

      setLoading(false);
    } catch (err) {
      setErrMessage('Error fetching data');
      setLoading(false);
    }
    controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchData();
    return () => {
      controller.abort();
    };
  }, []);

  const handleSelectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    const sortedTransactions = sortTransactions(transactions, e.target.value);
    setTransactions(sortedTransactions);
  };

  const handleAddTransaction = () => {
    setEditModalShow(true);
  };

  const handleExport = async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const exportResponse = await exportTransactions(axiosPrivate, controller);
      setLoading(false);
    } catch (err) {
      setErrMessage('Error exporting data');
      setLoading(false);
      navigate('/login', { replace: true });
    }
    controller.abort();
  };

  const sortTransactions = (transactions: Transaction[], sortBy: string) => {
    const [sort, order] = sortBy.split('-');
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
    return sortedTransactions;
  };

  return (
    <>
      {loading ? (
        <LoadingSpinnerCenter />
      ) : errMessage ? (
        <Alert variant="danger">{errMessage}</Alert>
      ) : (
        <Container>
          <div className="d-flex flex-row">
            <div className="d-flex mt-4 ms-auto">
              <Form.Select onChange={handleSelectSort} value={sortBy}>
                <option value="date-DESC">Time (newest first)</option>
                <option value="date-ASC">Time (olders first)</option>
                <option value="amount-ASC">Amount (lowest first)</option>
                <option value="amount-DESC">Amount (highest first)</option>
              </Form.Select>
            </div>
          </div>
          <div className="d-flex flex-row mt-4">
            <div className="d-flex flex-column bg-light p-3 mx-2 rounded">
              <h4>Transactions</h4>
              <Button
                className="my-3"
                onClick={handleAddTransaction}
                variant="success"
              >
                + Add
              </Button>
              <Button variant="secondary" onClick={handleExport}>
                Export to Excel
              </Button>
            </div>
            <div className="d-flex flex-fill flex-column">
              <Container className="d-flex justify-content-center"></Container>
              <TransactionsList
                transactions={transactions}
                accounts={accounts}
                sortBy={sortBy}
                fetchData={fetchData}
              />
            </div>
          </div>
          <TransactionEditModal
            show={editModalShow}
            onHide={() => setEditModalShow(false)}
            accounts={accounts}
            transaction={null}
            fetchData={fetchData}
            isAdding={true}
          />
        </Container>
      )}
    </>
  );
};

export default TransactionsPage;
