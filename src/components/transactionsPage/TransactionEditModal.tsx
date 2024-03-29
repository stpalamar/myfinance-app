import { useState, useCallback, BaseSyntheticEvent } from 'react';

import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';

import Transaction from '../../types/Transaction.type';
import Account from '../../types/Account.type';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {
  getReceiptByTransactionId,
  deleteReceiptFromTransaction,
  addReceiptToTransaction,
} from '../../services/receipts.service';

import {
  updateTransaction,
  addTransaction,
} from '../../services/transactions.service';

import ChangeTypeButtonField from '../UI/ChangeTypeButtonField';
import DatePickerField from '../UI/DatePickerField';

import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

type Props = {
  show: boolean;
  onHide: () => void;
  transaction: Transaction | null;
  accounts: Account[];
  fetchData: () => Promise<any>;
  isAdding: boolean;
};

const TransactionEditModal = ({
  show,
  onHide,
  transaction,
  accounts,
  fetchData,
  isAdding,
}: Props) => {
  const [receipt, setReceipt] = useState<string | null>(null);
  const [errMessage, setErrMessage] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const schema = yup.object({
    description: yup.string().required("Description can't be empty"),
    date: yup.date().required(),
    type: yup.number().required(),
    amount: yup
      .number()
      .required('Amount must be non-zero number')
      .positive('Amount must be non-zero number'),
    accountId: yup.string().required('Select account'),
  });

  const initialValues =
    transaction != null && !isAdding
      ? {
          id: transaction.id,
          description: transaction.description,
          date: transaction.date,
          type: transaction.type,
          amount: transaction.amount,
          accountId: transaction.accountId,
        }
      : {
          date: new Date(Date.now()).toISOString(),
          amount: 0,
          description: '',
          accountId: '',
          type: 0,
          accountName: null,
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
      await updateTransaction(axiosPrivate, controller, values as Transaction);
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
      await addTransaction(axiosPrivate, controller, values as Transaction);
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

  const handleDeleteReceipt = async () => {
    const controller = new AbortController();
    try {
      await deleteReceiptFromTransaction(
        axiosPrivate,
        controller,
        transaction!.id
      );
      transaction!.receiptId = null;
      setReceipt(null);
    } catch (err) {
      setErrMessage('Error deleting receipt');
    }
    controller.abort();
  };

  const handleAddReceipt = async (
    values: FormikValues,
    actions: {
      setSubmitting: any;
    }
  ) => {
    actions.setSubmitting(true);
    const body = new FormData();
    body.append('ImageData', values.file);
    const controller = new AbortController();
    try {
      await addReceiptToTransaction(
        axiosPrivate,
        controller,
        transaction!.id,
        body
      );
      const receiptResponse = await getReceiptByTransactionId(
        axiosPrivate,
        controller,
        transaction!.id
      );
      setReceipt(receiptResponse.imageDataBase64);
      actions.setSubmitting(false);
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
    controller.abort();
  };

  const fetchReceipt = useCallback(async () => {
    if (transaction?.receiptId == null) return;
    const controller = new AbortController();
    try {
      const receiptResponse = await getReceiptByTransactionId(
        axiosPrivate,
        controller,
        transaction!.id
      );
      setReceipt(receiptResponse.imageDataBase64);
    } catch (err) {
      setErrMessage('Error fetching data');
    }
    controller.abort();
  }, [axiosPrivate, transaction]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {isAdding ? 'ADD ' : 'EDIT '} TRANSACTION
        </Modal.Title>
      </Modal.Header>
      <Tabs
        defaultActiveKey="edit-info"
        className="mt-3 px-2"
        onSelect={(key) => {
          if (key === 'edit-receipt') {
            if (receipt == null && transaction?.receiptId != null) {
              fetchReceipt();
            }
          }
        }}
      >
        <Tab eventKey="edit-info" title="Info">
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
                <Modal.Body>
                  <div>
                    {errMessage && <Alert variant="danger">{errMessage}</Alert>}
                  </div>

                  <ChangeTypeButtonField name="type" />
                  <Form.Group>
                    <Form.Label>Account</Form.Label>
                    <Form.Select
                      name="accountId"
                      onChange={handleChange}
                      value={values.accountId}
                    >
                      {isAdding && (
                        <option key="0" value="" disabled>
                          Choose...
                        </option>
                      )}
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.accountId && (
                      <Form.Text className="text-danger">
                        {errors.accountId}
                      </Form.Text>
                    )}
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
                          const newValue = value.replace(',', '.');
                          const regex = /^(?!0{2,})\d*(\.\d{0,2})?$/;
                          if (newValue.length === 0) {
                            setFieldValue('amount', newValue);
                          } else if (regex.test(newValue)) {
                            setFieldValue('amount', newValue);
                          }
                        }}
                        value={values.amount}
                        isInvalid={
                          errors.amount && touched.amount ? true : false
                        }
                      />
                    </InputGroup>
                    {errors.amount && (
                      <Form.Text className="text-danger">
                        {errors.amount}
                      </Form.Text>
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
                    {errors.date && (
                      <Form.Text className="text-danger">Choose date</Form.Text>
                    )}
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
                      isInvalid={
                        errors.description && touched.description ? true : false
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* <pre style={{ margin: '0 auto' }}>
                    {JSON.stringify(
                      { ...values, ...errors, isValid, isSubmitting },
                      null,
                      2
                    )}
                  </pre> */}
                </Modal.Body>
                {dirty && (
                  <Modal.Footer className="d-flex justify-content-center">
                    {isSubmitting ? (
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      <>
                        {!isAdding && (
                          <Button className="flex-fill" onClick={handleReset}>
                            Revert
                          </Button>
                        )}

                        <Button
                          className="flex-fill"
                          variant="success"
                          type="submit"
                        >
                          {isAdding ? 'Add' : 'Save'}
                        </Button>
                      </>
                    )}
                  </Modal.Footer>
                )}
              </Form>
            )}
          </Formik>
        </Tab>
        {!isAdding && (
          <Tab eventKey="edit-receipt" title="Receipt">
            <div className="d-flex m-3">
              {receipt ? (
                <div className="d-flex flex-column">
                  <Image
                    src={`data:image/jpeg;base64,${receipt}`}
                    className="rounded img-fluid mb-2"
                  ></Image>
                  <Button variant="danger" onClick={handleDeleteReceipt}>
                    Delete receipt
                  </Button>
                </div>
              ) : (
                <Formik
                  initialValues={{ file: null }}
                  onSubmit={handleAddReceipt}
                  validationSchema={yup.object().shape({
                    file: yup.mixed().required('File is required'),
                  })}
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
                    return (
                      <Form
                        noValidate
                        onSubmit={handleSubmit}
                        className="d-flex justify-content-center flex-column"
                      >
                        <Form.Group>
                          <Form.Label>Receipt file upload</Form.Label>
                          <Form.Control
                            as="input"
                            id="file"
                            name="file"
                            type="file"
                            onChange={(event: BaseSyntheticEvent) => {
                              setFieldValue(
                                'file',
                                event.currentTarget.files[0]
                              );
                            }}
                            isInvalid={
                              errors.file && touched.file ? true : false
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.file}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className="mt-4">
                          Add receipt
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </div>
          </Tab>
        )}
      </Tabs>
    </Modal>
  );
};

export default TransactionEditModal;
