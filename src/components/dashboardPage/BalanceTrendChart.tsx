import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { calculateSum } from '../transactionsPage/TransactionsList';

import Transaction from '../../types/Transaction.type';

import Card from 'react-bootstrap/Card';

type Props = {
  transactions: Transaction[];
};

const BalanceTrendChart = ({ transactions }: Props) => {
  const daysOfMonth = () => {
    const dateNow = new Date(Date.now());
    const amountOfDaysInMonth = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      0
    ).getDate();
    dateNow.setDate(1);

    const dates = [];

    for (let i = 0; i < amountOfDaysInMonth; i++) {
      const date = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate()
      );
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const accountBalanceThisMonth = daysOfMonth().map((date) => {
    if (date > new Date(Date.now())) {
      return {
        date,
      };
    }
    return {
      date,
      balance: calculateSum(
        transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            new Date(
              transactionDate.getFullYear(),
              transactionDate.getMonth(),
              transactionDate.getDate()
            ) <= date
          );
        })
      ),
    };
  });

  const data = {
    labels: accountBalanceThisMonth.map((i) => i.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Balance',
        data: accountBalanceThisMonth.map(
          (accountBalance) => accountBalance.balance
        ),
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    tension: 0.1,
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          labelColor: function (context: any): any {
            return {
              borderColor: 'rgb(255, 99, 132)' as const,
              backgroundColor: 'rgb(255, 99, 132)' as const,
              borderWidth: 0,
              borderRadius: 0,
            };
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };
  ChartJS.register(Filler);

  return (
    <Card className="w-100 m-2">
      <Card.Header>Balance trend</Card.Header>
      <Card.Body className="p-4">
        <Line options={options} data={data} />
      </Card.Body>
    </Card>
  );
};

export default BalanceTrendChart;
