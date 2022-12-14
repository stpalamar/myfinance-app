import { useState, useMemo, useEffect } from 'react';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';

import TransactionItem from './TransactionItem';
import TransactionsGroupByDate from './TransactionsGroupByDate';
import SelectTransactionsCheckbox from '../UI/SelectTransactionsCheckbox';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

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

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  sortBy: string;
};

const TransactionsList = ({ transactions, accounts, sortBy }: Props) => {
  const [isSelectedAll, setIsSelectedAll] = useState(SELECT_STATES.None);
  const [isSelected, setIsSelected] = useState<Transaction[]>([]);

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

  return (
    <Container>
      <Card bg={isSelected.length ? 'warning' : ''}>
        <Card.Header className="d-flex">
          <Container className="d-flex mx-0 px-0">
            <SelectTransactionsCheckbox
              value={isSelectedAll}
              onChange={handleSelectAll}
            />
          </Container>
          <Container className="d-flex justify-content-between mx-2">
            <div className="d-flex ms-auto">
              <span className="fw-semibold transactions-sum">
                {transactionsSum}
              </span>
            </div>
          </Container>
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
              />
            );
          })
        ) : (
          <TransactionsGroupByDate
            transactions={transactions}
            accounts={accounts}
            handleSelect={handleSelect}
            isSelected={isSelected}
          />
        )}
      </Stack>
    </Container>
  );
};

export default TransactionsList;
