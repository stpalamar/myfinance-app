import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Account from '../../types/Account.type';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { deleteAccount } from '../../services/accounts.service';

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

type Props = {
  show: boolean;
  onHide: () => void;
  account: Account;
  fetchData: () => Promise<any>;
};

const AccountDeleteModal = ({ show, onHide, account, fetchData }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    const controller = new AbortController();
    try {
      await deleteAccount(axiosPrivate, controller, account.id);
      controller.abort();
      onHide();
      setIsDeleting(false);
      navigate('/accounts');
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
          <p>Do you really want to remove the account {account.name}?</p>
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

export default AccountDeleteModal;
