import Deposit from '../../types/Deposit.type';

import DepositItem from './DepositItem';

import Stack from 'react-bootstrap/Stack';

type Props = {
  deposits: Deposit[];
};

const DepositsList = ({ deposits }: Props) => {
  console.log(deposits);
  return (
    <>
      <div className="text-center">
        {deposits.length === 0 && <p>No deposits found</p>}
      </div>
      <Stack gap={2}>
        {deposits.map((deposit) => {
          return <DepositItem deposit={deposit} />;
        })}
      </Stack>
    </>
  );
};

export default DepositsList;
