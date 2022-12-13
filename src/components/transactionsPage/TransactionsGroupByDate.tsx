import Transaction from '../../types/Transaction.type';
import TransactionItem from './TransactionItem';

import { calculateSum } from './TransactionsList';

import Stack from 'react-bootstrap/Stack';

type Props = {
  list: Transaction[];
  handleSelect: (transaction: Transaction) => void;
  isSelected: Transaction[];
};
const TransactionsGroupByDate = ({ list, handleSelect, isSelected }: Props) => {
  const dates = list.reduce((dates: any, transaction) => {
    const date = transaction.date.split('T')[0];
    if (!dates[date]) {
      dates[date] = [];
    }
    dates[date].push(transaction);
    return dates;
  }, {});

  const groupDates = Object.keys(dates).map((date) => {
    return {
      date,
      transactions: dates[date],
    };
  });

  const getDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date(Date.now()).toDateString();
    if (date.toDateString() === today) {
      return 'Today';
    }
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (date.toDateString() === yesterday) {
      return 'Yesterday';
    }
    const year = new Date(Date.now()).getFullYear();
    if (date.getFullYear() === year) {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      {groupDates.map((group: any, index) => {
        return (
          <>
            <div className="d-flex justify-content-between mt-3 mx-3">
              <div key={index} className="d-flex">
                <span className="fw-semibold text-body">
                  {getDate(group.date)}
                </span>
              </div>
              <div className="d-flex">
                <span className="fw-semibold transactions-sum mx-3 px-1">
                  {calculateSum(group.transactions)}
                </span>
              </div>
            </div>

            {group.transactions.map((transaction: Transaction) => {
              return (
                <Stack className="mt-2">
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    handleSelect={handleSelect}
                    isSelected={isSelected.includes(transaction)}
                  />
                </Stack>
              );
            })}
          </>
        );
      })}
    </div>
  );
};

export default TransactionsGroupByDate;