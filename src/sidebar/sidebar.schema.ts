import { ISidebar } from '../types';
import * as yup from 'yup';

export const sidebarValidationSchema: {
  [key in keyof ISidebar]?: yup.AnySchema;
} = {
  name: yup.string().required(),
  icon: yup.string().required(),
  url: yup.string().required(),
  slug: yup.string().required(),
  displayOrder: yup.string().required(),
  status: yup.boolean().required().default(true),
};
