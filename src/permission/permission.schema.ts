import * as yup from 'yup';

export const permissionValidationSchema = {
  role: yup.string().required(),
  permission: yup
    .array(
      yup
        .object({
          sidebar: yup.string().required(),
          create: yup.string().required(),
          delete: yup.string().required(),
          update: yup.string().required(),
        })
        .required(),
    )
    .required(),
};
