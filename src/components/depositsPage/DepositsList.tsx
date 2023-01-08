import { useContext } from 'react';

import { DepositsContext } from '../DepositsPage';
import DepositItem from './DepositItem';

import Stack from 'react-bootstrap/Stack';

const DepositsList = () => {
  const { deposits } = useContext(DepositsContext);
  return (
    <>
      <div className="text-center">
        {deposits.length === 0 && <p>No deposits found</p>}
      </div>
      <Stack gap={2}>
        {deposits.map((deposit) => {
          return <DepositItem key={deposit.id} deposit={deposit} />;
        })}
      </Stack>
    </>
  );
};

export default DepositsList;
