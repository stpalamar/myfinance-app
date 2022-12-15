import React, { useEffect } from 'react';

import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';

import { axiosPrivate } from '../../api/axios';
import { updateTransaction } from '../../services/transactions.service';

import ChangeTypeButtonField from '../UI/ChangeTypeButtonField';
import DatePickerField from '../UI/DatePickerField';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

type Props = {
  show: boolean;
  onHide: () => void;
  transaction: Transaction;
  accounts: Account[];
  fetchData: () => Promise<any>;
};

const TransactionEditModal = ({
  show,
  onHide,
  transaction,
  accounts,
  fetchData,
}: Props) => {
  const schema = yup.object({
    description: yup.string().required("Description can't be empty"),
    date: yup.date().required(),
    type: yup.number().required(),
    amount: yup
      .number()
      .required('Amount must be non-zero number')
      .positive('Amount must be non-zero number'),
    accountId: yup.string().required(),
  });

  const handleSave = async (
    values: FormikValues,
    actions: {
      setSubmitting: any;
    }
  ) => {
    actions.setSubmitting(true);
    const controller = new AbortController();
    try {
      await updateTransaction(axiosPrivate, controller, values as Transaction);
      controller.abort();
      onHide();
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} onExited={() => {}} size="lg" centered>
      <Formik
        validationSchema={schema}
        onSubmit={handleSave}
        initialValues={{
          id: transaction.id,
          description: transaction.description,
          date: transaction.date,
          type: transaction.type,
          amount: transaction.amount,
          accountId: transaction.accountId,
        }}
      >
        {({
          dirty,
          handleSubmit,
          handleChange,
          handleBlur,
          handleReset,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                EDIT TRANSACTION
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChangeTypeButtonField name="type" />
              <Form.Group>
                <Form.Label>Account</Form.Label>
                <Form.Select
                  name="accountId"
                  onChange={handleChange}
                  value={values.accountId}
                >
                  {accounts.map((account) => (
                    <option value={account.id}>{account.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{values.type ? '+' : '-'}</InputGroup.Text>
                  <Form.Control
                    className="input-amount"
                    type="text"
                    name="amount"
                    placeholder="0"
                    onChange={(e) => {
                      e.preventDefault();
                      const { value } = e.target;
                      const newValue = value.replace(',', '.');
                      const regex = /^(?!0{2,})\d*(\.\d{0,2})?$/;
                      if (newValue.length === 0) {
                        setFieldValue('amount', newValue);
                      } else if (values.amount === 0) {
                        console.log(values.amount);
                      } else if (regex.test(newValue)) {
                        setFieldValue('amount', newValue);
                      }
                    }}
                    value={values.amount}
                    isInvalid={errors.amount ? true : false}
                  />
                </InputGroup>
                {errors.amount && (
                  <Form.Text className="text-danger">{errors.amount}</Form.Text>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <DatePickerField
                  name="date"
                  filterDate={(date: Date) => {
                    return new Date() > date;
                  }}
                  dateFormat="MMMM d, yyyy"
                  customInput={<Form.Control type="input" />}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Time</Form.Label>
                <DatePickerField
                  name="date"
                  filterDate={(date: Date) => {
                    return new Date() > date;
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat={'h:mm aa'}
                  customInput={<Form.Control type="input" />}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  isInvalid={errors.description ? true : false}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
              <pre style={{ margin: '0 auto' }}>
                {JSON.stringify(
                  { ...values, ...errors, isValid, isSubmitting },
                  null,
                  2
                )}
              </pre>
            </Modal.Body>
            {dirty && (
              <Modal.Footer className="d-flex justify-content-center">
                {isSubmitting ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <>
                    <Button className="flex-fill" onClick={handleReset}>
                      Revert
                    </Button>
                    <Button
                      className="flex-fill"
                      variant="success"
                      type="submit"
                    >
                      Save
                    </Button>
                  </>
                )}
              </Modal.Footer>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default TransactionEditModal;
