import { useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';

type monthInterest = {
  date: Date;
  startBalance: number;
  interest: number;
  endBalance: number;
};

type Props = {
  deposit: {
    initialDeposit: number;
    monthlyContribution: number;
    interestRate: number;
    startDate: string;
    months: number;
  };
};

const DepositMonthlyTable = ({ deposit }: Props) => {
  const [monthInterests, setMonthInterests] = useState([] as monthInterest[]);

  useEffect(() => {
    const monthInterests = [] as monthInterest[];

    const interest =
      (deposit.initialDeposit * (deposit.interestRate / 100)) / 12;

    monthInterests.push({
      date: new Date(deposit.startDate),
      startBalance: deposit.initialDeposit,
      interest: interest,
      endBalance: deposit.initialDeposit + interest,
    });

    for (let i = 1; i < deposit.months; i++) {
      const startBalance = (monthInterests[i - 1].endBalance +
        deposit.monthlyContribution) as number;
      const interest = (startBalance * (deposit.interestRate / 100)) / 12;
      const endBalance = startBalance + interest;

      const date = new Date(deposit.startDate);

      monthInterests.push({
        date: new Date(date.setMonth(date.getMonth() + i)),
        startBalance: startBalance,
        interest: interest,
        endBalance: endBalance,
      });
    }
    setMonthInterests(monthInterests);
  }, [deposit]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Start balance</th>
          <th>Interest</th>
          <th>End balance</th>
        </tr>
      </thead>
      <tbody>
        {monthInterests.map((monthInterest: monthInterest, index) => {
          return (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>
                {monthInterest.date.getMonth() + 1}/
                {monthInterest.date.getFullYear()}
              </td>
              <td>${monthInterest.startBalance.toFixed(2)}</td>
              <td>${monthInterest.interest.toFixed(2)}</td>
              <td>${monthInterest.endBalance.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default DepositMonthlyTable;
