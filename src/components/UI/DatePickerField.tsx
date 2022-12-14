import { useField, useFormikContext } from 'formik';

import DatePicker from 'react-datepicker';

const DatePickerField = ({ ...props }: any) => {
  const { setFieldTouched } = useFormikContext();
  const [field, meta, helpers] = useField(props);

  console.log(field.value);
  return (
    <DatePicker
      {...field}
      {...props}
      selected={new Date(field.value)}
      onChangeRaw={(e) => {
        setFieldTouched(field.value, true, true);
      }}
      onChange={(date: Date) => {
        helpers.setValue(date);
      }}
    />
  );
};

export default DatePickerField;
