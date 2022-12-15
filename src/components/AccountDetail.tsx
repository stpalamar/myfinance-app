import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getTransactions } from '../services/transactions.service';
import { getAccounts } from '../services/accounts.service';

import Transaction from '../types/Transaction.type';
import Account from '../types/Account.type';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import TransactionsList from './transactionsPage/TransactionsList';
import TransactionEditModal from './transactionsPage/TransactionEditModal';

const AccountDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const { accountId } = useParams();

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
      const sortedTransactions = transactionsResponse.sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date)
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
      navigate('/login', { replace: true });
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

  return (
    <div className="d-flex">
      <div></div>
      <TransactionsList
        transactions={transactions}
        accounts={accounts}
        sortBy={'date-DESC'}
        fetchData={fetchData}
      />
      <TransactionEditModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        accounts={accounts}
        transaction={null}
        fetchData={fetchData}
        isAdding={true}
      />
    </div>
  );
};

export default AccountDetail;
