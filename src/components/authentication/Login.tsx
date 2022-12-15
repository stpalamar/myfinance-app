import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';
import { AxiosError } from 'axios';

import { login } from '../../services/auth.service';
import useAuth from '../../hooks/useAuth';
import { Auth } from '../../context/AuthProvider';

import CustomInput from '../UI/CustomInput';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login = () => {
  const { setAuth, auth, persist, setPersist } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const schema = yup.object({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Required'),
    password: yup.string().required('Required'),
  });

  const handleLogin = async (
    values: FormikValues,
    actions: {
      resetForm: any;
    }
  ) => {
    try {
      setLoading(true);

      const response = await login(values.email, values.password);
      const { firstName, lastName, email, accessToken } = response;
      setAuth({ firstName, lastName, email, accessToken } as Auth);
      actions.resetForm({ values: { email: '', password: '' } });

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

  const togglePersist = () => {
    setPersist((prev: boolean) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist.toString());
  }, [persist]);

  return (
    <Row className="container-fluid min-vh-100 d-flex flex-column justify-content-center mx-0 px-4">
      <Row className="justify-content-center mt-3 mx-0 px-0">
        <Col className="col-xl-4 col-lg-6 text-center">
          {errMessage && <Alert variant="danger">{errMessage}</Alert>}
        </Col>
      </Row>
      <Row className="justify-content-center mx-0 px-0">
        <Col className="rounded border bg-light col-xl-4 col-lg-6">
          <h1 className="text-center mt-3">Log in</h1>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={schema}
            onSubmit={handleLogin}
          >
            {(props) => (
              <Form noValidate onSubmit={props.handleSubmit} className="p-4">
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
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={persist}
                    onChange={togglePersist}
                  />
                </Form.Group>

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
                    <>Log in</>
                  )}
                  <span className="visually-hidden">Loading...</span>
                </Button>
              </Form>
            )}
          </Formik>
          <p className="fw-semibold">
            Don't have account? <Link to="/signup">Sign up</Link>
          </p>
        </Col>
      </Row>
    </Row>
  );
};

export default Login;
