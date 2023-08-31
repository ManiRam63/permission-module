import { IAuth, IResetPassword } from 'src/types';
import * as yup from 'yup';

export const authValidationSchema: {
  [key in keyof IAuth]?: yup.AnySchema;
} = {
  email: yup.string().email('please enter valid email'),
  password: yup.string().required(),
};
// set schema for reset password
export const resetPasswordValidationSchema: {
  [key in keyof IResetPassword]?: yup.AnySchema;
} = {
  oldPassword: yup.string().required('Old Password is required'),
  newPassword: yup.string().required('New Password is required'),
};
