import { useState } from 'react';
import { FieldHookConfig, useField } from 'formik';

import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

type Props = {
  initialValue: number;
  setFieldValue: (
    field: string,
    value: number,
    shouldValidate?: boolean
  ) => void;
};

const TransactionChangeTypeButton = ({
  initialValue,
  setFieldValue,
}: Props) => {
  const [radioValue, setRadioValue] = useState(initialValue);

  const radios = [
    { name: 'Expense', value: 0 },
    { name: 'Income', value: 1 },
  ];

  return (
    <Form.Group>
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={idx % 2 ? 'outline-success' : 'outline-danger'}
            name="type"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => {
              const value = parseInt(e.currentTarget.value);
              setRadioValue(value);
              setFieldValue('type', value, false);
            }}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Form.Group>
  );
};

export default TransactionChangeTypeButton;
