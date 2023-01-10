import { useState } from 'react';

import Transaction from '../../types/Transaction.type';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { duplicateTransaction } from '../../services/transactions.service';

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

type Props = {
  show: boolean;
  onHide: () => void;
  transaction: Transaction;
  fetchData: () => Promise<any>;
};

const TransactionsDuplicateModal = ({
  show,
  onHide,
  transaction,
  fetchData,
}: Props) => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    setIsDuplicating(true);
    const controller = new AbortController();
    try {
      await duplicateTransaction(axiosPrivate, controller, transaction.id);
      controller.abort();
      onHide();
      fetchData();
      setIsDuplicating(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err.response) {
          setErrMessage('No server response');
        } else {
          setErrMessage('Something went wrong');
        }
      }
      setIsDuplicating(false);
    }
  };

  return (
    <Modal show={show} size="lg" onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          DUPLICATE TRANSACTION
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{errMessage && <Alert variant="danger">{errMessage}</Alert>}</div>
        <Container>
          <p>Do you really want to duplicate this transaction?</p>
        </Container>
        <Card>
          <div className="p-3 d-flex justify-content-between">
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
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center px-4">
        {isDuplicating ? (
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

export default TransactionsDuplicateModal;
