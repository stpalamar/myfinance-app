import { useState } from 'react';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';
import TransactionEditModal from './TransactionEditModal';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/card';
import Form from 'react-bootstrap/Form';

type Props = {
  transaction: Transaction;
  accounts: Account[];
  isSelected: any;
  handleSelect: any;
};

const TransactionItem = ({
  transaction,
  accounts,
  isSelected,
  handleSelect,
}: Props) => {
  const [modalShow, setModalShow] = useState(false);

  const handleTransactionClick = () => {
    setModalShow(true);
  };

  return (
    <>
      <Card className="transaction-card">
        <Card.Body className="d-flex">
          <Form.Check
            key={transaction.id}
            id={transaction.id}
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
          ></Form.Check>
          <Container
            className="d-flex justify-content-between mx-2"
            onClick={handleTransactionClick}
          >
            <div className="d-flex w-25">{transaction.accountName}</div>
            <div className="d-flex align-items-center">
              <span className="transaction-description">
                {transaction.description}
              </span>
            </div>
            <div className="d-flex ms-auto">
              {transaction.type ? (
                <span className="fw-semibold transaction-income">
                  {transaction.amount}
                </span>
              ) : (
                <span className="fw-semibold transaction-expense">
                  {-transaction.amount}
                </span>
              )}
            </div>
          </Container>
        </Card.Body>
      </Card>
      <TransactionEditModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        transaction={transaction}
        accounts={accounts}
      ></TransactionEditModal>
    </>
  );
};

export default TransactionItem;
