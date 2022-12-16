import { BaseSyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';

import { AxiosError } from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { importTransactions } from '../services/importExport.service';

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const ImportPage = () => {
  const [errMessage, setErrMessage] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    file: yup.mixed().required('File is required'),
  });

  const handleImport = async (
    values: FormikValues,
    actions: {
      setSubmitting: any;
    }
  ) => {
    actions.setSubmitting(true);
    const body = new FormData();
    body.append('excelFile', values.file);
    const controller = new AbortController();
    try {
      await importTransactions(axiosPrivate, controller, body);
      controller.abort();
      actions.setSubmitting(false);
      navigate('/accounts');
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
    <Container className="d-flex container-fluid flex-row justify-content-center">
      <div className="border p-4 m-4 rounded d-flex flex-column">
        <div>{errMessage && <Alert variant="danger">{errMessage}</Alert>}</div>
        <Formik
          initialValues={{ file: null }}
          onSubmit={handleImport}
          validationSchema={schema}
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
                  <Form.Label>Excel file upload</Form.Label>
                  <Form.Control
                    as="input"
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event: BaseSyntheticEvent) => {
                      console.log(event.currentTarget.files[0]);
                      setFieldValue('file', event.currentTarget.files[0]);
                    }}
                    isInvalid={errors.file && touched.file ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.file}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="mt-4">
                  Import
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Container>
  );
};

export default ImportPage;
