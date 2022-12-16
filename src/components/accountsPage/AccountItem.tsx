import { useNavigate } from 'react-router-dom';

import Account from '../../types/Account.type';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/card';

type Props = {
  account: Account;
};

const AccountItem = ({ account }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <Card
        className="list-card"
        onClick={() => {
          navigate('detail/' + account.id, {
            replace: true,
            state: { account },
          });
        }}
      >
        <Card.Body className="d-flex list-card-body">
          <Container className="d-flex justify-content-between mx-2 px-0">
            <div className="d-flex w-25">{account.name}</div>
            <div className="d-flex ms-auto">
              <span className="fw-semibold ">{account.amount.toFixed(2)}</span>
            </div>
          </Container>
        </Card.Body>
      </Card>
    </>
  );
};

export default AccountItem;
