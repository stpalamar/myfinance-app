import { useContext, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import Deposit from '../../types/Deposit.type';
import { DepositsContext } from '../DepositsPage';

import DepositDeleteModal from './DepositDeleteModal';

import Card from 'react-bootstrap/card';
import Button from 'react-bootstrap/Button';

type Props = {
  deposit: Deposit;
};

const DepositItem = ({ deposit }: Props) => {
  const { selectedDeposit, setSelectedDeposit } = useContext(DepositsContext);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const handleDeleteClick = () => {
    setDeleteModalShow(true);
  };

  return (
    <>
      <Card
        className="list-card"
        bg={
          selectedDeposit != null && selectedDeposit.id === deposit.id
            ? 'secondary'
            : ''
        }
        text={
          selectedDeposit != null && selectedDeposit.id === deposit.id
            ? 'white'
            : 'dark'
        }
      >
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex">{deposit.name}</div>
          <div className="d-flex">
            <Button
              variant="danger"
              className="p-0 m-0"
              onClick={handleDeleteClick}
            >
              <MdDelete className="m-1" />
            </Button>
          </div>
        </Card.Header>
        <Card.Body
          className="d-flex list-card-body justify-content-between"
          onClick={() => {
            setSelectedDeposit(deposit);
          }}
        >
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
      <DepositDeleteModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        deposit={deposit}
      />
    </>
  );
};

export default DepositItem;
