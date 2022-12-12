import React from 'react';

import { Form, InputGroup } from 'react-bootstrap';
import { Field, FieldProps } from 'formik';

type Props = {
  as?: any;
  md?: any;
  controlId: string;
  label: string;
  name: string;
  type: string;
  inputGroupPrepend?: any;
};

const FormTextField = ({
  as,
  md,
  controlId,
  label,
  name,
  type,
  inputGroupPrepend,
}: Props) => {
  return (
    <Field
      name={name}
      children={(props: any) => {
        const { field, form, meta } = props;
        const isValid = !form.errors[field.name];
        const isInvalid = form.touched[field.name] && !isValid;
        return (
          <Form.Group as={as} md={md} controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <InputGroup>
              {inputGroupPrepend}
              <Form.Control
                {...field}
                type={type}
                isValid={form.touched[field.name] && isValid}
                isInvalid={isInvalid}
                feedback={meta.error}
              />

              <Form.Control.Feedback type="invalid">
                {meta.error}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        );
      }}
    />
  );
};

export default FormTextField;
