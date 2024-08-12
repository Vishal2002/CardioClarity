import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link,useNavigate } from 'react-router-dom';
import { register} from '../service/apihandler';
import { generateTerraWidgetSession } from '../service/terraApi';


const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  age: Yup.number()
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .required('Required'),
  provider: Yup.string()
    .required('Required')
});


const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
     const response=await register(values);
     console.log(response);
     if(response.status===201){
      const terraSession = await generateTerraWidgetSession(response.data.data._id);
      window.open(terraSession.url, '_blank');
      navigate('/signin')
     }
     else{
      navigate('/signup')
     }
    
      
    } catch (error) {
      setFieldError('email', 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-purple-800">Sign Up</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              name: '',
              gender: '',
              email: '',
              password: '',
              age: '',
              provider: 'FITBIT'
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <ErrorMessage name="name" component="div" className="mt-2 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="mt-1">
                    <Field
                      as="select"
                      name="gender"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                  </div>
                  <ErrorMessage name="gender" component="div" className="mt-2 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <Field
                      type="email"
                      name="email"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="mt-2 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      type="password"
                      name="password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="mt-2 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <div className="mt-1">
                    <Field
                      type="number"
                      name="age"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <ErrorMessage name="age" component="div" className="mt-2 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                    Provider
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="provider"
                      disabled
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                    />
                  </div>
                  <ErrorMessage name="provider" component="div" className="mt-2 text-sm text-red-600" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Up
                  </button>
                  <div className='my-2 flex gap-2 justify-center'>
                   <span>Already have Account?</span>
                   <Link className=' cursor-pointer  text-blue-400'  to='/signin'>Signin</Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Signup;