import { useState, useContext } from 'react';

import Deposit from '../../types/Deposit.type';
import { DepositsContext } from '../DepositsPage';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { deleteDeposit } from '../../services/deposits.service';

import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

type Props = {
  show: boolean;
  onHide: () => void;
  deposit: Deposit;
};

const DepositDeleteModal = ({ show, onHide, deposit }: Props) => {
  const { deposits, setDeposits, selectedDeposit, setSelectedDeposit } =
    useContext(DepositsContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    setIsDeleting(true);
    const controller = new AbortController();
    try {
      await deleteDeposit(axiosPrivate, controller, deposit.id);
      controller.abort();
      setDeposits(deposits.filter((d) => d.id !== deposit.id));
      if (selectedDeposit && selectedDeposit.id === deposit.id) {
        setSelectedDeposit(null);
      }
      onHide();
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
          REMOVE DEPOSIT
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{errMessage && <Alert variant="danger">{errMessage}</Alert>}</div>
        <Container>
          <p>Do you really want to remove this deposit?</p>
          <Card className="list-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex">{deposit.name}</div>
            </Card.Header>
            <Card.Body className="d-flex justify-content-between">
              <div>
                <div>
                  <span>Initial amount: </span>
                  <span className="fw-semibold ">
                    {deposit.initialDeposit.toFixed(2)}$
                  </span>
                </div>
                <div>
                  <span>Monthly contribution: </span>
                  <span className="fw-semibold ">
                    {deposit.monthlyContribution.toFixed(2)}$
                  </span>
                </div>
                <div>
                  <span>Interest rate: </span>
                  <span className="fw-semibold ">{deposit.interestRate}%</span>
                </div>
              </div>
              <div>
                <div>
                  <span>Period of deposit: </span>
                  <span className="fw-semibold ">{deposit.months} months</span>
                </div>
                <div>
                  <span>Start date: </span>
                  <span className="fw-semibold ">
                    {new Date(deposit.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
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

export default DepositDeleteModal;
