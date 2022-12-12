import Transaction from '../../types/Transaction.type';

import TransactionItem from './TransactionItem';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';

type Props = {
  list: Transaction[];
};

const TransactionsList = ({ list }: Props) => {
  return (
    <Container>
      <Stack gap={2}>
        {list.map((transaction) => {
          return (
            <TransactionItem key={transaction.id} transaction={transaction} />
          );
        })}
      </Stack>
    </Container>
  );
};

export default TransactionsList;
