import { useState, useMemo, useRef } from 'react';

import Transaction from '../../types/Transaction.type';

import TransactionItem from './TransactionItem';
import SelectTransactionsCheckbox from '../UI/SelectTransactionsCheckbox';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

export const SELECT_STATES = {
  All: 'Checked',
  Multiple: 'Indeterminate',
  None: 'Empty',
};

type Props = {
  list: Transaction[];
};

const TransactionsList = ({ list }: Props) => {
  const [isSelectedAll, setIsSelectedAll] = useState(SELECT_STATES.None);
  const [isSelected, setIsSelected] = useState<Transaction[]>([]);

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
    let newState;

    if (isSelectedAll === SELECT_STATES.None) {
      newState = SELECT_STATES.All;
      setIsSelected(list);
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
    const transaction = list.find((i) => i.id === id);

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
      <Card>
        <Card.Header className="d-flex">
          <Container className="d-flex mx-0 px-0">
            {/* <Form.Check
              type="checkbox"
              label="Select all"
              ref={checkRef}
              // checked={isSelectedAll}
              onChange={handleSelectAll}
            /> */}
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
