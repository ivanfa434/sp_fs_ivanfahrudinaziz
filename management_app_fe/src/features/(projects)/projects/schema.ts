import * as Yup from "yup";

export const CreateTaskSchema = Yup.object().shape({
  title: Yup.string().required("Task title is required"),
  description: Yup.string(),
  assigneeId: Yup.string(),
});
