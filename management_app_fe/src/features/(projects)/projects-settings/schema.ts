import * as Yup from "yup";

export const InviteMemberSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
