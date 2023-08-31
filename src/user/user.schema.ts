import { IUser } from 'src/types';
import * as yup from 'yup';

export const userValidationSchema: {
  [key in keyof IUser]?: yup.AnySchema;
} = {
  name: yup.string().required(),
  email: yup.string().email('Please enter valid email').required(),
  password: yup.string().required(),
  phone: yup
    .string()
    .max(13)
    .required('Phone must not more then 13 characters'),
  status: yup.boolean().default(true),
  role: yup.string().required('Role is required'),
};

export const findValidationSchema: {
  [key in keyof IUser]?: yup.AnySchema;
} = {
  name: yup.string().trim(),
  email: yup.string().trim(),
  phone: yup.string().trim(),
};
