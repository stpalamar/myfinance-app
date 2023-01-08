import Deposit from '../../types/Deposit.type';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/card';

type Props = {
  deposit: Deposit;
};

const DepositItem = ({ deposit }: Props) => {
  return (
    <>
      <Card className="list-card" onClick={() => {}}>
        <Card.Header>
          <div className="d-flex w-25">{deposit.name}</div>
        </Card.Header>
        <Card.Body className="d-flex list-card-body justify-content-between">
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
    </>
  );
};

export default DepositItem;
