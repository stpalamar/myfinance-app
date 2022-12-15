import { useField } from 'formik';

import DatePicker from 'react-datepicker';

const DatePickerField = ({ ...props }: any) => {
  const [field, meta, helpers] = useField(props);

  return (
    <DatePicker
      {...props}
      selected={new Date(field.value)}
      onChange={(date: Date) => {
        helpers.setValue(date);
      }}
    />
  );
};

export default DatePickerField;
