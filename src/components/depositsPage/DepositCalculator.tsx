import React, { useContext, useState } from 'react';

import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { AxiosError } from 'axios';

import Deposit from '../../types/Deposit.type';

import { DepositsContext } from '../DepositsPage';
import { addDeposit } from '../../services/deposits.service';

import CustomInput from '../UI/CustomInput';
import DatePickerField from '../UI/DatePickerField';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import DepositMonthlyTable from './DepositMonthlyTable';

const DepositCalculator = () => {
  const { deposits, setDeposits, selectedDeposit, setSelectedDeposit } =
    useContext(DepositsContext);
  const [errMessage, setErrMessage] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const schema = yup.object({
    name: yup.string().required("Description can't be empty"),
    initialDeposit: yup
      .number()
      .required('Field is required')
      .positive('Field must be positive number')
      .max(10000000, 'Max value is 10 000 000'),
    monthlyContribution: yup
      .number()
      .required('Field is required')
      .positive('Field must be positive number')
      .max(10000000, 'Max value is 10 000 000'),
    interestRate: yup
      .number()
      .required('Field is required')
      .positive('Field must be positive number')
      .max(1000, 'Max value is 1 000'),
    startDate: yup.date().required('Start date is required'),
    months: yup
      .number()
      .required('Period of deposit is required')
      .max(120, 'Max value is 120'),
  });

  const initialValues =
    selectedDeposit != null
      ? {
          id: selectedDeposit.id,
          name: selectedDeposit.name,
          initialDeposit: selectedDeposit.initialDeposit,
          monthlyContribution: selectedDeposit.monthlyContribution,
          interestRate: selectedDeposit.interestRate,
          startDate: selectedDeposit.startDate,
          months: selectedDeposit.months,
        }
      : {
          name: '',
          initialDeposit: 0,
          monthlyContribution: 0,
          interestRate: 0,
          startDate: new Date(Date.now()),
          months: 0,
        };
  console.log(initialValues);

  const handleCalculate = (values: FormikValues, formikBag: any) => {
    setSelectedDeposit({
      id: values.id,
      name: values.name,
      initialDeposit: values.initialDeposit,
      monthlyContribution: values.monthlyContribution,
      interestRate: values.interestRate,
      startDate: values.startDate,
      months: values.months,
    });
  };

  const handleAddDeposit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    submitForm: any,
    values: FormikValues
  ) => {
    submitForm();
    const controller = new AbortController();
    try {
      const response = await addDeposit(
        axiosPrivate,
        controller,
        values as Deposit
      );
      setDeposits([...deposits, response]);
      controller.abort();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err.response) {
          setErrMessage('No server response');
        } else {
          setErrMessage('Something went wrong');
        }
      }
    }
  };

  return (
    <div className="border rounded p-3 flex-fill">
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleCalculate}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          submitForm,
          isSubmitting,
          isValid,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <CustomInput
              label="Name"
              name="name"
              type="name"
              placeholder="Enter name"
            />
            <Form.Group>
              <Form.Label>Initial deposit</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="initialDeposit"
                  placeholder="0"
                  value={values.initialDeposit}
                  onChange={handleChange}
                  isInvalid={
                    errors.initialDeposit && touched.initialDeposit
                      ? true
                      : false
                  }
                />
              </InputGroup>
              {errors.initialDeposit && (
                <Form.Text className="text-danger">
                  {errors.initialDeposit}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Monthly contribution</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="monthlyContribution"
                  placeholder="0"
                  value={values.monthlyContribution}
                  onChange={handleChange}
                  isInvalid={
                    errors.monthlyContribution && touched.monthlyContribution
                      ? true
                      : false
                  }
                />
              </InputGroup>
              {errors.monthlyContribution && (
                <Form.Text className="text-danger">
                  {errors.monthlyContribution}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Start date</Form.Label>
              <DatePickerField
                name="startDate"
                dateFormat="MMMM, yyyy"
                showMonthYearPicker
                customInput={<Form.Control type="input" />}
              />
              {errors.startDate && (
                <Form.Text className="text-danger">Choose start date</Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Over a period of</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="months"
                  placeholder="0"
                  value={values.months}
                  onChange={handleChange}
                  isInvalid={errors.months && touched.months ? true : false}
                />
                <InputGroup.Text>Months</InputGroup.Text>
              </InputGroup>
              {errors.months && (
                <Form.Text className="text-danger">{errors.months}</Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>APY</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="interestRate"
                  placeholder="0"
                  value={values.interestRate}
                  onChange={handleChange}
                  isInvalid={
                    errors.interestRate && touched.interestRate ? true : false
                  }
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
              {errors.interestRate && (
                <Form.Text className="text-danger">
                  {errors.interestRate}
                </Form.Text>
              )}
            </Form.Group>
            <div className="d-flex flex-column">
              <div className="mt-3 d-flex">
                <Button variant="primary" className="flex-fill me-1">
                  Save
                </Button>
                <Button
                  variant="success"
                  className="flex-fill ms-1"
                  onClick={(e) => handleAddDeposit(e, submitForm, values)}
                >
                  Add
                </Button>
              </div>
              <div className="d-flex mt-2">
                <Button type="submit" variant="warning" className="flex-fill">
                  Calculate
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {selectedDeposit && (
        <div className="mt-3">
          <h4>Monthly Schedule</h4>
          <DepositMonthlyTable deposit={selectedDeposit} />
        </div>
      )}
    </div>
  );
};

export default DepositCalculator;
