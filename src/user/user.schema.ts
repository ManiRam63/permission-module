import { IUser } from 'src/types';
import * as yup from 'yup';

export const userValidationSchema: {
  [key in keyof IUser]?: yup.AnySchema;
} = {
  name: yup.string().required(),
  email: yup.string().email('please enter valid email'),
  password: yup.string().required(),
  phone: yup.string().required(),
  status: yup.boolean().required().default(true),
};

export const findValidationSchema: {
  [key in keyof IUser]?: yup.AnySchema;
} = {
  name: yup.string().trim(),
  email: yup.string().trim(),
  phone: yup.string().trim(),
};
