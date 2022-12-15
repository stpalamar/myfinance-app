import Account from '../../types/Account.type';

import AccountItem from './AccountItem';

import Stack from 'react-bootstrap/Stack';

type Props = {
  accounts: Account[];
};

const AccountsList = ({ accounts }: Props) => {
  return (
    <Stack gap={2}>
      {accounts.map((account) => {
        return <AccountItem account={account} key={account.id} />;
      })}
    </Stack>
  );
};

export default AccountsList;
