import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getAccounts } from '../services/accounts.service';

import Account from '../types/Account.type';
import AccountsList from './accountsPage/AccountsList';
import AccountEditModal from './accountsPage/AccountEditModal';

import LoadingSpinnerCenter from './UI/LoadingSpinnerCenter';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AccountsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editAccountModalShow, setAccountEditModalShow] = useState(false);
  const [sortBy, setSortBy] = useState<string>('Default');

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
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
    controller.abort();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    const sortedAccounts = sortAccounts(accounts, e.target.value);
    setAccounts(sortedAccounts);
  };

  const handleAddAccount = () => {
    setAccountEditModalShow(true);
  };

  const sortAccounts = (accounts: Account[], sortBy: string) => {
    const [sort, order] = sortBy.split('-');
    const sortedTransactions = [...accounts] as Account[];

    if (sort === 'Default') {
      fetchData();
    } else if (sort === 'AZ') {
      sortedTransactions.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (sort === 'ZA') {
      sortedTransactions.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else if (sort === 'balance') {
      if (order === 'ASC') {
        sortedTransactions.sort((a, b) => {
          return a.amount - b.amount;
        });
      } else if (order === 'DESC') {
        sortedTransactions.sort((a, b) => {
          return b.amount - a.amount;
        });
      }
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
                <option value="Default">Default</option>
                <option value="AZ">A-Z</option>
                <option value="ZA">Z-A</option>
                <option value="balance-ASC">Balance (lowest first)</option>
                <option value="balance-DESC">Balance (highest first)</option>
              </Form.Select>
            </div>
          </div>
          <div className="d-flex flex-row mt-4">
            <div className="d-flex flex-column bg-light p-3 mx-2 rounded">
              <h4>Accounts</h4>
              <Button
                className="my-3 mx-2"
                onClick={handleAddAccount}
                variant="success"
              >
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

      <AccountEditModal
        show={editAccountModalShow}
        onHide={() => setAccountEditModalShow(false)}
        account={null}
        fetchData={fetchData}
        isAdding={true}
      />
    </>
  );
};

export default AccountsPage;
