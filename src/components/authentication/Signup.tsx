import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Formik } from 'formik';
import * as yup from 'yup';
import { AxiosError } from 'axios';

import { signup } from '../../services/auth.service';
import useAuth from '../../hooks/useAuth';

import CustomInput from '../UI/CustomInput';

import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Signup = () => {
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const schema = yup.object({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Required'),
    password: yup
      .string()
      .min(6)
      .matches(passwordRules, { message: 'Please create a stronger password' })
      .required('Required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const handleSignup = async (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    actions: {
      resetForm: any;
    }
  ) => {
    try {
      setLoading(true);

      const response = await signup(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
      const { firstName, lastName, email, accessToken } = response;
      setAuth({ firstName, lastName, email, accessToken });

      actions.resetForm({
        values: { firstName: '', lastName: '', email: '', password: '' },
      });

      setErrMessage('');
      setLoading(false);

      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err.response) {
          setErrMessage('No server response');
        } else {
          setErrMessage('Invalid email or password');
        }
        setLoading(false);
      }
    }
  };

  return (
    <Row className="container-fluid min-vh-100 d-flex flex-column justify-content-center mx-0 px-4">
      <Row className="justify-content-center mt-3 mx-0 px-0">
        <Col className="col-xl-4 col-lg-6 text-center">
          {errMessage && <Alert variant="danger">{errMessage}</Alert>}
        </Col>
      </Row>
      <Row className="justify-content-center mx-0 px-0">
        <Col className="rounded border bg-light col-xl-4 col-lg-6">
          <h1 className="text-center mt-3">Create an account</h1>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={schema}
            onSubmit={handleSignup}
          >
            {(props) => (
              <Form noValidate onSubmit={props.handleSubmit} className="p-4">
                <CustomInput
                  label="First name"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                />

                <CustomInput
                  label="Last name"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                />

                <CustomInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                />

                <CustomInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />

                <CustomInput
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="d-grid col-6 mx-auto mt-3 justify-content-center"
                >
                  {loading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <>Sign up</>
                  )}
                  <span className="visually-hidden">Loading...</span>
                </Button>
              </Form>
            )}
          </Formik>
          <p className="fw-semibold">
            Already have account? <Link to="/login">Log in</Link>
          </p>
        </Col>
      </Row>
    </Row>
  );
};

export default Signup;
