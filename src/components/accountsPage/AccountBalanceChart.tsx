import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { calculateSum } from '../transactionsPage/TransactionsList';
import Transaction from '../../types/Transaction.type';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  transactions: Transaction[];
};

const AccountBalanceChart = ({ transactions }: Props) => {
  const last30Days = [...Array(30)]
    .map((_, i) => {
      const dateNow = new Date(Date.now());
      const date = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate()
      );
      date.setDate(date.getDate() - i);
      return date;
    })
    .reverse();

  const accountBalanceLast30Days = last30Days.map((date) => {
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
    labels: accountBalanceLast30Days.map((i) => i.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Balance',
        data: accountBalanceLast30Days.map(
          (accountBalance) => accountBalance.balance
        ),
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Account balance',
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
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default AccountBalanceChart;
