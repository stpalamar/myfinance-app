import Deposit from '../../types/Deposit.type';

import Stack from 'react-bootstrap/Stack';

type Props = {
  deposits: Deposit[];
};

const DepositsList = ({ deposits }: Props) => {
  return (
    <>
      <div className="text-center">
        {deposits.length === 0 && <p>No deposits found</p>}
      </div>
      <Stack gap={2}>
        {deposits.map((deposit) => {
          return (
            <div>
              <p>{deposit.name}</p>
              <p>{deposit.initialDeposit}</p>
              <p>{deposit.monthlyContribution}</p>
              <p>{deposit.interestRate}</p>
              <p>{deposit.startDate.toISOString()}</p>
              <p>{deposit.months}</p>
            </div>
          );
        })}
      </Stack>
    </>
  );
};

export default DepositsList;
