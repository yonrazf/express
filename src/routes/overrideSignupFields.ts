import { OverrideSignupFieldsParams, SignupFormFields } from "@frontegg/types";

export default ({
  fields,
  t,
  Yup,
}: OverrideSignupFieldsParams): SignupFormFields => {
  return {
    firstName: {
      ...fields.firstName,
      flex: 6,
      autoFocus: true,
    },
    lastName: {
      ...fields.lastName,
      flex: 6,
    },
    email: {
      ...fields.email,
      flex: 6,
      autoFocus: false,
    },
    phoneNumber: {
      ...fields.phoneNumber,
      hide: false,
      flex: 6,
      order: undefined,
    },

    password: {
      ...fields.password,
      flex: 6,
    },
    confirmPassword: {
      ...fields.confirmPassword,
      hide: false,
      flex: 6,
    },
    disclaimer: fields.disclaimer,
    newsletter: {
      type: "custom",
      fieldType: "disclaimer",
      initialValue: false,
      fieldProps: {
        name: "newsletter",
        label: t("newsletter"),
      },
    },
  };
};
