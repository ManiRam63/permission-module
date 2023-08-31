import { IAction } from '../types';
import * as yup from 'yup';
const actionName = ['add', 'update', 'view', 'delete'];
export const actionValidationSchema: {
  [key in keyof IAction]?: yup.AnySchema;
} = {
  name: yup.string().required('Action name is required ').oneOf(actionName),
  status: yup.boolean().required().default(true),
};
export const actionStatusValidationSchema: {
  [key in keyof IAction]?: yup.AnySchema;
} = {
  status: yup.boolean().required().default(true),
};
