import { useState, useMemo, useEffect } from 'react';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';

import TransactionItem from './TransactionItem';
import TransactionsGroupByDate from './TransactionsGroupByDate';
import TransactionsDeleteModal from './TransactionsDeleteModal';
import SelectTransactionsCheckbox from '../UI/SelectTransactionsCheckbox';

import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  sortBy: string;
  fetchData: () => Promise<any>;
};

const TransactionsList = ({
  transactions,
  accounts,
  sortBy,
  fetchData,
}: Props) => {
  const [isSelectedAll, setIsSelectedAll] = useState(SELECT_STATES.None);
  const [isSelected, setIsSelected] = useState<Transaction[]>([]);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    setIsSelectedAll(SELECT_STATES.None);
    setIsSelected([]);
  }, [sortBy]);

  const transactionsSum: any = useMemo(
    () =>
      isSelected.length ? calculateSum(isSelected) : calculateSum(transactions),
    [isSelected, transactions]
  );

  const handleSelectAll = () => {
    let newState;

    if (isSelectedAll === SELECT_STATES.None) {
      newState = SELECT_STATES.All;
      setIsSelected(transactions);
    } else if (isSelectedAll === SELECT_STATES.All) {
      newState = SELECT_STATES.None;
      setIsSelected([]);
    } else if (isSelectedAll === SELECT_STATES.Multiple) {
      newState = SELECT_STATES.None;
      setIsSelected([]);
    }

    setIsSelectedAll(newState as string);
  };

  const handleSelect = (e: any) => {
    const { id, checked } = e.target;
    const transaction = transactions.find((i) => i.id === id);

    setIsSelectedAll(SELECT_STATES.Multiple);
    setIsSelected([...isSelected, transaction!]);
    if (!checked) {
      setIsSelectedAll(SELECT_STATES.Multiple);
      setIsSelected(isSelected.filter((t) => t.id !== transaction!.id));
    }
    if (!checked && isSelected.length === 1) {
      setIsSelectedAll(SELECT_STATES.None);
      setIsSelected(isSelected.filter((t) => t.id !== transaction!.id));
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalShow(true);
  };

  return (
    <>
      <Container className="p-0">
        <Card bg={isSelected.length ? 'warning' : ''}>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex mx-0 px-0 py-1">
              <SelectTransactionsCheckbox
                value={isSelectedAll}
                onChange={handleSelectAll}
              />
            </div>
            {isSelected.length != 0 && (
              <div className="d-flex mx-0 px-0 justify-content-center align-items-center">
                <div>{isSelected.length} selected transactions &nbsp;</div>
                <Button onClick={handleDeleteClick} variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            )}
            <div className="d-flex mx-2">
              <span className="fw-semibold transactions-sum">
                {transactionsSum}
              </span>
            </div>
          </Card.Header>
        </Card>
        <Stack gap={2} className="mt-3">
          {sortBy === 'amount-DESC' || sortBy === 'amount-ASC' ? (
            transactions.map((transaction) => {
              return (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  accounts={accounts}
                  handleSelect={handleSelect}
                  isSelected={isSelected.includes(transaction)}
                  fetchData={fetchData}
                />
              );
            })
          ) : (
            <TransactionsGroupByDate
              transactions={transactions}
              accounts={accounts}
              handleSelect={handleSelect}
              isSelected={isSelected}
              fetchData={fetchData}
            />
          )}
        </Stack>
      </Container>
      <TransactionsDeleteModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        transactions={isSelected}
        fetchData={fetchData}
      />
    </>
  );
};

export const SELECT_STATES = {
  All: 'Checked',
  Multiple: 'Indeterminate',
  None: 'Empty',
};

export const calculateSum = (transactions: Transaction[]) => {
  let sum = 0;
  transactions.forEach((transaction) => {
    transaction.type
      ? (sum += transaction.amount)
      : (sum -= transaction.amount);
  });
  return sum;
};

export default TransactionsList;
