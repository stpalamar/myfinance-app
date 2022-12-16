import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getTransactionsByAccount } from '../services/transactions.service';
import { getAccounts } from '../services/accounts.service';

import Transaction from '../types/Transaction.type';
import Account from '../types/Account.type';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import TransactionsList, {
  calculateSum,
} from './transactionsPage/TransactionsList';
import TransactionEditModal from './transactionsPage/TransactionEditModal';
import AccountEditModal from './accountsPage/AccountEditModal';
import AccountDeleteModal from './accountsPage/AccountDeleteModal';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

const AccountDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account>(
    location.state.account
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editTransactionModalShow, setTransactionEditModalShow] =
    useState(false);
  const [editAccountModalShow, setAccountEditModalShow] = useState(false);
  const [deleteAccountModalShow, setAccountDeleteModalShow] = useState(false);
  const [tab, setTab] = useState('balance');
  const { accountId } = useParams();

  const todayTransactionsSum: any = useMemo(
    () =>
      calculateSum(
        transactions.filter(
          (transaction) =>
            transaction.date.split('T')[0] ===
            new Date(Date.now()).toISOString().slice(0, 10)
        )
      ),
    [transactions]
  );

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const transactionsResponse = (await getTransactionsByAccount(
        axiosPrivate,
        controller,
        accountId!
      )) as Transaction[];
      const sortedTransactions = transactionsResponse.sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date)
      );

      const accountsResponse = (await getAccounts(
        axiosPrivate,
        controller
      )) as Account[];

      setCurrentAccount(accountsResponse.find((a) => a.id === accountId)!);
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

  const handleAddTransaction = () => {
    setTransactionEditModalShow(true);
  };

  const handleEditAccount = () => {
    setAccountEditModalShow(true);
  };

  const handleDeleteAccount = () => {
    setAccountDeleteModalShow(true);
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-center">
        <Container className="mx-0 my-4 px-0">
          <div className="mx-0 border rounded">
            <div className="bg-light d-flex justify-content-between p-4">
              <div className="d-flex">
                <h3>Account Detail</h3>
              </div>
              <div className="d-flex ">
                <Button className="mx-2" onClick={handleEditAccount}>
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="d-flex flex-column p-4">
              <span>Name</span>
              <span className="fw-semibold fs-5">{currentAccount.name}</span>
            </div>
            <div className="border-top px-4 py-3">
              <Nav
                defaultActiveKey="balance"
                variant="pills"
                onSelect={(eventKey: any) => setTab(eventKey)}
              >
                <Nav.Item>
                  <Nav.Link eventKey="balance">Balance</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="transactions">Transactions</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </Container>
      </div>
      <Container className="p-0">
        {tab === 'transactions' && (
          <>
            <TransactionsList
              transactions={transactions}
              accounts={accounts}
              sortBy={'date-DESC'}
              fetchData={fetchData}
            />
            <Button
              className="my-3 mx-2"
              onClick={handleAddTransaction}
              variant="success"
            >
              + Add
            </Button>
          </>
        )}
        {tab === 'balance' && (
          <div className="d-flex flex-column p-4 bg-light rounded">
            <div className="d-flex flex-column mb-3">
              <span>TODAY</span>
              <span className="fw-semibold fs-4">{todayTransactionsSum}</span>
            </div>
            <div>CHART...</div>
          </div>
        )}
      </Container>

      <AccountDeleteModal
        show={deleteAccountModalShow}
        onHide={() => setAccountDeleteModalShow(false)}
        account={currentAccount}
        fetchData={fetchData}
      />

      <AccountEditModal
        show={editAccountModalShow}
        onHide={() => setAccountEditModalShow(false)}
        account={currentAccount}
        fetchData={fetchData}
        isAdding={false}
      />

      <TransactionEditModal
        show={editTransactionModalShow}
        onHide={() => setTransactionEditModalShow(false)}
        accounts={accounts}
        transaction={null}
        fetchData={fetchData}
        isAdding={true}
      />
    </div>
  );
};

export default AccountDetail;
