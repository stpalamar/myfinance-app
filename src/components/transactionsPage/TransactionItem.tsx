import { useState } from 'react';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';

import TransactionEditModal from './TransactionEditModal';
import TransactionsDeleteModal from './TransactionsDeleteModal';

import CustomToggle from '../UI/CustomToggle';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/card';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

type Props = {
  transaction: Transaction;
  accounts: Account[];
  isSelected: any;
  handleSelect: any;
  fetchData: () => Promise<any>;
};

const TransactionItem = ({
  transaction,
  accounts,
  isSelected,
  handleSelect,
  fetchData,
}: Props) => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const handleTransactionClick = () => {
    setEditModalShow(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalShow(true);
  };

  return (
    <>
      <Card className="list-card">
        <Card.Body className="d-flex">
          <Form.Check
            key={transaction.id}
            id={transaction.id}
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
          ></Form.Check>
          <Container
            className="d-flex justify-content-between mx-2 px-0 list-card-body"
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
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleDeleteClick}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
      </Card>
      <TransactionEditModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        transaction={transaction}
        accounts={accounts}
        fetchData={fetchData}
        isAdding={false}
      />
      <TransactionsDeleteModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        transactions={[transaction]}
        fetchData={fetchData}
      />
    </>
  );
};

export default TransactionItem;
