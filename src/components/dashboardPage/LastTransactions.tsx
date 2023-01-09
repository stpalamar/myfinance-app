import Transaction from '../../types/Transaction.type';

import Card from 'react-bootstrap/Card';

type Props = {
  transactions: Transaction[];
};

const LastTransactions = ({ transactions }: Props) => {
  return (
    <Card className="w-100 m-2">
      <Card.Header>Last transactions</Card.Header>
      <Card.Body className="p-4">
        <ul className="list-group list-group-flush last-transactions">
          {transactions.slice(0, 5).map((transaction) => (
            <li
              key={transaction.id}
              className="d-flex flex-row justify-content-between list-group-item"
            >
              <div className="d-flex flex-column align-items-start justify-content-center">
                <span className="fs-6 fw-bolder">
                  {transaction.description}
                </span>
                <span>{transaction.accountName}</span>
              </div>
              <div className="d-flex flex-column align-items-end justify-content-center">
                {transaction.type ? (
                  <span className="fw-semibold transaction-income">
                    {transaction.amount}$
                  </span>
                ) : (
                  <span className="fw-semibold transaction-expense">
                    {-transaction.amount}$
                  </span>
                )}
                <span className="date">
                  {new Date(transaction.date).toLocaleString([], {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default LastTransactions;
