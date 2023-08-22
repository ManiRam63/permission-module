import { IAuth } from 'src/types';
import * as yup from 'yup';

export const authValidationSchema: {
  [key in keyof IAuth]?: yup.AnySchema;
} = {
  email: yup.string().email('please enter valid email'),
  password: yup.string().required(),
};
