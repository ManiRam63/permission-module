import { IRole } from '../types';
import * as yup from 'yup';

export const roleValidationSchema: {
  [key in keyof IRole]?: yup.AnySchema;
} = {
  name: yup.string().required(),
  status: yup.boolean().required().default(true),
};
export const roleStatusValidationSchema: {
  [key in keyof IRole]?: yup.AnySchema;
} = {
  status: yup.boolean().required().default(true),
};
