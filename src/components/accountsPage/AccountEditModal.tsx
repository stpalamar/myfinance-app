import { useState } from 'react';

import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';

import Account from '../../types/Account.type';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { addAccount, updateAccount } from '../../services/accounts.service';

import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

type Props = {
  show: boolean;
  onHide: () => void;
  account: Account | null;
  fetchData: () => Promise<any>;
  isAdding: boolean;
};

const AccountEditModal = ({
  show,
  onHide,
  account,
  fetchData,
  isAdding,
}: Props) => {
  const [errMessage, setErrMessage] = useState<string>('');

  const axiosPrivate = useAxiosPrivate();

  const schema = yup.object({
    name: yup.string().required("Name can't be empty"),
    initialAmount: yup.number().required(),
  });

  const initialValues =
    account != null && !isAdding
      ? {
          id: account.id,
          name: account.name,
          initialAmount: account.initialAmount,
        }
      : {
          name: '',
          initialAmount: 0,
        };

  const handleSave = async (
    values: FormikValues,
    actions: {
      setSubmitting: any;
    }
  ) => {
    actions.setSubmitting(true);
    const controller = new AbortController();
    try {
      await updateAccount(axiosPrivate, controller, values as Account);
      controller.abort();
      await fetchData();
      onHide();
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

  const handleAdd = async (
    values: FormikValues,
    actions: {
      setSubmitting: any;
    }
  ) => {
    actions.setSubmitting(true);
    const controller = new AbortController();
    try {
      await addAccount(axiosPrivate, controller, values as Account);
      controller.abort();
      onHide();
      fetchData();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err.response) {
          setErrMessage('No server response');
        } else {
          console.log(err.response);
          setErrMessage('Something went wrong');
        }
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Formik
        validationSchema={schema}
        onSubmit={isAdding ? handleAdd : handleSave}
        initialValues={initialValues}
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
                {isAdding ? 'ADD ' : 'EDIT '} ACCOUNT
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {errMessage && <Alert variant="danger">{errMessage}</Alert>}
              </div>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  isInvalid={errors.name && touched.name ? true : false}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Initial amount</Form.Label>
                <Form.Control
                  className="input-initial-amount"
                  type="text"
                  name="initialAmount"
                  placeholder="0"
                  onChange={(e) => {
                    e.preventDefault();
                    const { value } = e.target;
                    const newValue = value.replace(',', '.');
                    const regex = /^(?!0{2,})\d*(\.\d{0,2})?$/;
                    if (newValue.length === 0) {
                      setFieldValue('initialAmount', newValue);
                    } else if (regex.test(newValue)) {
                      setFieldValue('initialAmount', newValue);
                    }
                  }}
                  value={values.initialAmount}
                  isInvalid={
                    errors.initialAmount && touched.initialAmount ? true : false
                  }
                />
                {errors.initialAmount && (
                  <Form.Text className="text-danger">
                    {errors.initialAmount}
                  </Form.Text>
                )}
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
                  <Button className="flex-fill" variant="success" type="submit">
                    Save
                  </Button>
                )}
              </Modal.Footer>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AccountEditModal;
