import { FieldHookConfig, useField } from 'formik';

import Form from 'react-bootstrap/Form';

type Props = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
};

const CustomInput = (props: FieldHookConfig<string> & Props) => {
  const [field, meta] = useField(props);
  const { label, name, type, placeholder } = props;

  return (
    <Form.Group className="mb-3">
      <Form.Label className="d-flex">{label}</Form.Label>
      <Form.Control
        {...field}
        name={name}
        type={type}
        placeholder={placeholder}
        isInvalid={meta.touched && meta.error ? true : false}
      />
      <Form.Control.Feedback className="d-flex" type="invalid">
        {meta.touched && meta.error ? meta.error : ''}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default CustomInput;
