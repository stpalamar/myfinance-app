import { useState } from 'react';

import Transaction from '../../types/Transaction.type';
import TransactionEditModal from './TransactionEditModal';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/card';

type Props = {
  transaction: Transaction;
};

const TransactionItem = ({ transaction }: Props) => {
  const [modalShow, setModalShow] = useState(false);

  const handleCardClick = () => {
    setModalShow(true);
  };

  return (
    <>
      <Card onClick={handleCardClick}>
        <Card.Body>
          <Stack direction="horizontal" gap={3}>
            <div className="border">{transaction.description}</div>
            <div className="border">{transaction.amount}</div>
          </Stack>
        </Card.Body>
      </Card>
      <TransactionEditModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        transaction={transaction}
      ></TransactionEditModal>
    </>
  );
};

export default TransactionItem;
