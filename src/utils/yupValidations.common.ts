export const YUP_VALIDATION = {
  UUID: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi,
  PHONE_NUMBER: /^[0-9\.\+\/]+$/,
  EMAIL: /^(?!.*@[^,]*,)/,
  PHONE_NUMBER_WITH_COUNTRY_CODE: /^([+]\d{1})?\d{10}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\-$*.{}?"!@#%&\/\\,><':;|_~`^\]\[\)\(])\S{8,}$/,
};
