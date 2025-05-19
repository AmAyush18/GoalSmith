import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(60, "Experience cannot exceed 60 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

const baseEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  organization: z.string(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  current: z.boolean().default(false),
});

// Common refinement for end date validation
const endDateRefinement = (schema) =>
  schema.refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is current",
      path: ["endDate"],
    }
  );

// Experience schema
export const experienceSchema = endDateRefinement(
  baseEntrySchema.extend({
    organization: z.string().min(1, "Company/Organization is required"),
  })
);

// Education schema
export const educationSchema = endDateRefinement(
  baseEntrySchema.extend({
    organization: z.string().min(1, "School/University is required"),
    degree: z.string().optional(),
    gpa: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          // Allow empty string or valid GPA format (e.g., 3.5, 4.0, etc.)
          const gpaRegex = /^$|^[0-9]\.[0-9]$|^[0-4]\.[0-9][0-9]?$|^[0-4]\.0$|^[0-4]$/;
          return gpaRegex.test(val);
        },
        {
          message: "GPA must be in a valid format (e.g., 3.5, 4.0)",
        }
      ),
  })
);

// Project schema
export const projectSchema = endDateRefinement(
  baseEntrySchema.extend({
    organization: z.string().optional(), // Optional for projects
    projectUrl: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Project URL must be a valid URL",
        }
      ),
    technologies: z.string().optional(),
  })
);

export const entrySchema = experienceSchema;

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
