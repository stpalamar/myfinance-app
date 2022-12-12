import React, { useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';

import Transaction from '../../types/Transaction.type';
import FormTextField from '../UI/FormTextField';
import FormSelectField from '../UI/FormSelectField';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

type Props = {
  show: boolean;
  onHide: () => void;
  transaction: Transaction;
};

const TransactionEditModal = ({ show, onHide, transaction }: Props) => {
  const schema = yup.object({
    description: yup.string().required("Description can't be empty"),
    date: yup.date().required(),
    type: yup.number().required(),
    amount: yup.number().required(),
    accountId: yup.string().required(),
  });

  const [radioValue, setRadioValue] = useState(transaction.type);

  const radios = [
    { name: 'Expense', value: 0 },
    { name: 'Income', value: 1 },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      onEnter={() => setRadioValue(transaction.type)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          EDIT TRANSACTION
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Row>
                    <Form.Group>
                      <ButtonGroup>
                        {radios.map((radio, idx) => (
                          <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={
                              idx % 2 ? 'outline-success' : 'outline-danger'
                            }
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
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label>Account</Form.Label>
                      <Form.Control as="select" type="text" name="account">
                        <option>Account 1</option>
                        <option>Account 2</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="amount"
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
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={values.date.substring(
                          0,
                          values.date.indexOf('T')
                        )}
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;
                          const newDate = values.date.replace(/^[^T]+/, value);
                          setFieldValue('date', newDate);
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="time"
                        value={values.date.substring(
                          values.date.indexOf('T') + 1,
                          values.date.length
                        )}
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;
                          const newDate = values.date.replace(/[^T]*$/, value);
                          setFieldValue('date', newDate);
                        }}
                      />
                    </Form.Group>
                  </Row>
                  <Row></Row>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
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
                </Col>
              </Row>
              <pre style={{ margin: '0 auto' }}>
                {JSON.stringify(
                  { ...values, ...errors, isValid, isSubmitting },
                  null,
                  2
                )}
              </pre>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionEditModal;
