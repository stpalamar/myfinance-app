import Account from '../../types/Account.type';

import AccountItem from './AccountItem';

import Stack from 'react-bootstrap/Stack';

type Props = {
  accounts: Account[];
};

const AccountsList = ({ accounts }: Props) => {
  return (
    <>
      <div className="text-center">
        {accounts.length === 0 && <p>No accounts found</p>}
      </div>
      <Stack gap={2}>
        {accounts.map((account) => {
          return <AccountItem account={account} key={account.id} />;
        })}
      </Stack>
    </>
  );
};

export default AccountsList;
