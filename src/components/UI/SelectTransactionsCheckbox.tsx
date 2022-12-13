import { useEffect, useRef } from 'react';

import Form from 'react-bootstrap/Form';
import { SELECT_STATES } from '../transactionsPage/TransactionsList';

type Props = {
  value: string;
  onChange: (e: any) => void;
};

const SelectTransactionsCheckbox = ({ value, onChange }: Props) => {
  const checkboxRef = useRef<any>();

  useEffect(() => {
    if (value === SELECT_STATES.All) {
      checkboxRef.current.checked = true;
      checkboxRef.current.indeterminate = false;
    } else if (value === SELECT_STATES.None) {
      checkboxRef.current.checked = false;
      checkboxRef.current.indeterminate = false;
    } else if (value === SELECT_STATES.Multiple) {
      checkboxRef.current.checked = false;
      checkboxRef.current.indeterminate = true;
    }
  }, [value]);

  return (
    <Form.Check
      ref={checkboxRef}
      type="checkbox"
      onChange={onChange}
      label={value === SELECT_STATES.None ? 'Select all' : 'Deselect all'}
    />
  );
};

export default SelectTransactionsCheckbox;
