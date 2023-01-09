import Transaction from '../../types/Transaction.type';

import Card from 'react-bootstrap/Card';

type Props = {
  transactions: Transaction[];
};

const BalanceTrendChart = ({ transactions }: Props) => {
  return (
    <Card className="flex-fill mx-2">
      <Card.Header>Balance trend</Card.Header>
      <Card.Body className="p-4"></Card.Body>
    </Card>
  );
};

export default BalanceTrendChart;
