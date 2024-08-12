import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate,Link } from 'react-router-dom';
import { signin } from '../service/apihandler';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const Signin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await signin(values.email, values.password);
       console.log(response);
      const userData = {
        token: response.token,
        name: response.name,
        userId:response.userId,
        email: response.email
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      navigate('/');
    } catch (error) {
      setFieldError('email', 'Invalid credentials');
      setFieldError('password', 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-purple-800">
            Sign in 
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SigninSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md flex flex-col gap-2 shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
              <div className='my-2 flex gap-2 justify-center'>
                   <span>Register here?</span>
                   <Link className=' cursor-pointer  text-blue-400'  to='/signup'>Sign up</Link>
                  </div>
            </Form>
          )}
        </Formik>
        </div>
       
      </div>
    </div>
  );
};

export default Signin;