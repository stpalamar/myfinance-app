import { useState } from 'react';

import Transaction from '../../types/Transaction.type';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { deleteTransaction } from '../../services/transactions.service';

import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

type Props = {
  show: boolean;
  onHide: () => void;
  transactions: Transaction[];
  fetchData: () => Promise<any>;
};

const TransactionsDeleteModal = ({
  show,
  onHide,
  transactions,
  fetchData,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        transactions.map(async (transaction) => {
          const controller = new AbortController();
          await deleteTransaction(axiosPrivate, controller, transaction.id);
          controller.abort();
        })
      );
      onHide();
      fetchData();
      setIsDeleting(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err.response) {
          setErrMessage('No server response');
        } else {
          setErrMessage('Something went wrong');
        }
      }
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={show} size="lg" onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          REMOVE TRANSACTION
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{errMessage && <Alert variant="danger">{errMessage}</Alert>}</div>
        <Container>
          <p>Do you really want to remove this transaction?</p>
          <ListGroup>
            {transactions.map((transaction, index) => (
              <ListGroup.Item key={transaction.id}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <div>
                      <div className="fw-bold">{transaction.description}</div>
                      <div>{transaction.accountName}</div>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    <div>
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
                    <div>
                      {new Date(transaction.date).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center px-4">
        {isDeleting ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <Button className="flex-fill" onClick={() => onHide()}>
              No
            </Button>
            <Button
              className="flex-fill"
              variant="danger"
              onClick={handleDelete}
            >
              Yes
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionsDeleteModal;
