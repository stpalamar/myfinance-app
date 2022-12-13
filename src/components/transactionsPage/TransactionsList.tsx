import { useState, useMemo } from 'react';

import Transaction from '../../types/Transaction.type';

import TransactionItem from './TransactionItem';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

type Props = {
  list: Transaction[];
};

const TransactionsList = ({ list }: Props) => {
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);

  const [isSelected, setIsSelected] = useState<Transaction[]>([]);

  const [selectedTransactions, setSelectedTransactions] =
    useState<Transaction[]>();

  const calculateSum = (transactions: Transaction[]) => {
    let sum = 0;
    transactions.forEach((transaction) => {
      transaction.type
        ? (sum += transaction.amount)
        : (sum -= transaction.amount);
    });
    return sum;
  };

  const transactionsSum: any = useMemo(() => calculateSum(list), [list]);

  const handleSelectAll = () => {
    setIsSelectedAll(!isSelectedAll);
    setIsSelected(list);
    if (isSelectedAll) {
      setIsSelected([]);
    }
  };

  const handleSelect = (e: any) => {
    const { id, checked } = e.target;
    const transaction = list.find((i) => i.id === id);
    setIsSelected([...isSelected, transaction!]);
    if (!checked) {
      setIsSelectedAll(false);
      setIsSelected(isSelected.filter((t) => t.id !== transaction!.id));
    }
  };

  return (
    <Container>
      <Card>
        <Card.Header className="d-flex">
          <Container className="d-flex mx-0 px-0">
            <Form.Check
              type="checkbox"
              label="Select all"
              checked={isSelectedAll}
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
      <Stack gap={2}>
        {list.map((transaction) => {
          return (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              handleSelect={handleSelect}
              isSelected={isSelected.includes(transaction)}
            />
          );
        })}
      </Stack>
    </Container>
  );
};

export default TransactionsList;
