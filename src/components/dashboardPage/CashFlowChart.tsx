import Transaction from '../../types/Transaction.type';

import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';

type Props = {
  transactions: Transaction[];
};

const CashFlowChart = ({ transactions }: Props) => {
  const getIncomeLastMonth = () => {
    let income = 0;
    transactions
      .filter((transaction) => {
        const date = new Date(transaction.date);
        const today = new Date(Date.now());
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      })
      .forEach((transaction) => {
        if (transaction.type === 1) {
          income += transaction.amount;
        }
      });
    return income;
  };

  const getExpenseLastMonth = () => {
    let expense = 0;
    transactions
      .filter((transaction) => {
        const date = new Date(transaction.date);
        const today = new Date(Date.now());
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      })
      .forEach((transaction) => {
        if (transaction.type === 0) {
          expense += transaction.amount;
        }
      });
    return expense;
  };

  const getBalanceLastMonth = () => {
    return getIncomeLastMonth() - getExpenseLastMonth();
  };
  return (
    <Card className="flex-fill mx-2">
      <Card.Header>Cash flow</Card.Header>
      <Card.Body className="p-4">
        <div className="d-flex flex-column">
          <span className="fw-semibold">THIS MONTH</span>
          <span>{getBalanceLastMonth()}$</span>
        </div>
        <div>
          <div className="mt-2">
            <div className="d-flex flex-row justify-content-between">
              <span>Income</span>
              <span>{getIncomeLastMonth()}$</span>
            </div>
            <ProgressBar
              variant="success"
              now={
                (getIncomeLastMonth() /
                  (getExpenseLastMonth() === 0 ? 1 : getExpenseLastMonth())) *
                100
              }
              style={{ height: '25px' }}
            />
          </div>
          <div className="mt-2">
            <div className="d-flex flex-row justify-content-between">
              <span>Expense</span>
              <span>{getExpenseLastMonth()}$</span>
            </div>
            <ProgressBar
              variant="danger"
              now={
                (getExpenseLastMonth() /
                  (getIncomeLastMonth() === 0 ? 1 : getIncomeLastMonth())) *
                100
              }
              style={{ height: '25px' }}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CashFlowChart;
