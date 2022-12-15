import { useState } from 'react';
import { useField } from 'formik';

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

const ChangeTypeButtonField = ({ ...props }: any) => {
  const [field, meta, helpers] = useField(props);

  const radios = [
    { name: 'Expense', value: 0 },
    { name: 'Income', value: 1 },
  ];

  return (
    <Form.Group>
      {/* {radios.map((radio, idx) => (
        <>
          <input
            {...field}
            {...props}
            type="radio"
            checked={radio.value === field.value}
            onChange={(e) => {
              helpers.setValue(radio.value);
            }}
          />
          <label>{radio.value}</label>
        </>
      ))} */}
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            {...field}
            {...props}
            key={idx}
            variant={idx % 2 ? 'outline-success' : 'outline-danger'}
            value={radio.value === field.value}
            type="radio"
            checked={field.value === radio.value}
            onClick={(e) => {
              helpers.setValue(radio.value);
            }}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Form.Group>
  );
};

export default ChangeTypeButtonField;
