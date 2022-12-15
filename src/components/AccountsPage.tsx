import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getAccounts } from '../services/accounts.service';

import Account from '../types/Account.type';
import AccountsList from './accountsPage/AccountsList';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AccountsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [sortBy, setSortBy] = useState<string>('Default');

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const accountsResponse = (await getAccounts(
          axiosPrivate,
          controller
        )) as Account[];

        setAccounts(accountsResponse);

        setLoading(false);
      } catch (err) {
        setErrMessage('Error fetching data');
        setLoading(false);
        navigate('/login', { replace: true });
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, []);

  const handleSelectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    const sortedAccounts = sortAccounts(accounts, e.target.value);
    setAccounts(sortedAccounts);
  };

  const handleAddTransaction = () => {
    setEditModalShow(true);
  };

  const sortAccounts = (accounts: Account[], sortBy: string) => {
    const [sort, order] = sortBy.split('-');
    const sortedTransactions = [...accounts] as Account[];

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
                <option value="Default">Default</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
                <option value="balance-ASC">Balance (lowest first)</option>
                <option value="balance-DESC">Balance (highest first)</option>
              </Form.Select>
            </div>
          </div>
          <div className="d-flex flex-row mt-4">
            <div className="d-flex flex-column bg-light p-3 mx-2 rounded">
              <h4>Accounts</h4>
              <Button className="my-3 mx-2" onClick={() => {}}>
                + Add
              </Button>
            </div>
            <div className="d-flex flex-fill flex-column">
              <Container className="d-flex justify-content-center"></Container>
              <AccountsList accounts={accounts} />
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default AccountsPage;
