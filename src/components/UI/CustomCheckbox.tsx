import { FieldHookConfig, useField } from 'formik';

import Form from 'react-bootstrap/Form';

type Props = {
  label: string;
  name: string;
};

const CustomCheckbox = (props: FieldHookConfig<string> & Props) => {
  const [field, meta] = useField(props);
  const { label, name } = props;

  return <Form.Check {...field} type="checkbox" label={label} name={name} />;
};

export default CustomCheckbox;
