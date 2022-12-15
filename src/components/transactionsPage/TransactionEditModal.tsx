import { useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';

import ChangeTypeButtonField from '../UI/ChangeTypeButtonField';
import DatePickerField from '../UI/DatePickerField';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

type Props = {
  show: boolean;
  onHide: () => void;
  transaction: Transaction;
  accounts: Account[];
};

const TransactionEditModal = ({
  show,
  onHide,
  transaction,
  accounts,
}: Props) => {
  const schema = yup.object({
    description: yup.string().required("Description can't be empty"),
    date: yup.date().required(),
    type: yup.number().required(),
    amount: yup.number().required(),
    accountId: yup.string().required(),
  });

  return (
    <Modal show={show} onHide={onHide} onExited={() => {}} size="lg" centered>
      <Formik
        validationSchema={schema}
        onSubmit={console.log}
        initialValues={{
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
        }) => {
          console.log('formik' + values.type);
          return (
            <>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  EDIT TRANSACTION
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form noValidate onSubmit={handleSubmit}>
                  <ChangeTypeButtonField name="type" />
                  <Form.Group>
                    <Form.Label>Account</Form.Label>
                    <Form.Select name="accountId" onChange={handleChange}>
                      {accounts.map((account) => (
                        <option value={account.id}>{account.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        {values.type ? '+' : '-'}
                      </InputGroup.Text>
                      <Form.Control
                        className="input-amount"
                        type="text"
                        name="amount"
                        placeholder="0"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;
                          const regex = /\d+(\.\d*)?|\.\d+/;
                          if (regex.test(value)) {
                            setFieldValue('amount', parseFloat(value));
                          }
                        }}
                        value={values.amount}
                      />
                    </InputGroup>
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
                      isValid={
                        touched.description && errors.description ? false : true
                      }
                      isInvalid={
                        touched.description && errors.description ? true : false
                      }
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
                </Form>
              </Modal.Body>
              {console.log(dirty)}
              {dirty && (
                <Modal.Footer>
                  <Button onClick={onHide}>Save</Button>
                  <Button onClick={handleReset}>Revert</Button>
                </Modal.Footer>
              )}
            </>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default TransactionEditModal;
