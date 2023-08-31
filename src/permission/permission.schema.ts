import * as yup from 'yup';

export const permissionValidationSchema = {
  role: yup.string().required(),
  permission: yup
    .array(
      yup
        .object({
          sidebar: yup.string().required(),
          action: yup.string().required(),
        })
        .required(),
    )
    .required(),
};

export const updatePermissionValidationSchema = {
  role: yup.string().required(),
  //TODO:we need to modify later
  // permission: yup
  //   .array(
  //     yup
  //       .object({
  //         sidebar: yup.string().required(),
  //         action: yup.string().optional(),
  //       })
  //       .required(),
  //   )
  //   .required(),
  permission: yup
    .object({
      sidebar: yup.string().required(),
    })
    .required(''),
};
