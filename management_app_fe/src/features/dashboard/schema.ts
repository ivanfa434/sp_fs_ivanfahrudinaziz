import * as Yup from "yup";

export const CreateProjectSchema = Yup.object().shape({
  title: Yup.string()
    .required("Project title is required")
    .trim("Project title cannot contain only whitespace")
    .min(2, "Project title must be at least 2 characters")
    .max(100, "Project title cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z0-9\s\-_.,()[\]{}!@#$%^&*+=|\\:";'<>?/~`]+$/,
      "Project title contains invalid characters"
    ),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .trim(),
});
