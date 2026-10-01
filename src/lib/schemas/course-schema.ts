import { z } from "zod";

import type { Course } from "@/lib/types";

export const courseFormSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
  courseTitle: z
    .string()
    .trim()
    .min(1, "กรอกชื่อวิชา")
    .max(100, "ชื่อวิชายาวได้ไม่เกิน 100 ตัวอักษร"),
  curriculum: z.string().min(1, "เลือกหลักสูตร"),
  semester: z
    .string()
    .min(1, "เลือกภาคการศึกษา")
    .refine((val) => ["1", "2", "summer"].includes(val), {
      message: "เลือกภาคการศึกษา",
    }),
  description: z
    .string()
    .trim()
    .max(100, "รายละเอียดยาวได้ไม่เกิน 100 ตัวอักษร")
    .optional(),
  instructors: z
    .array(
      z.object({
        name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
        email: z
          .string()
          .trim()
          .toLowerCase()
          .email("อีเมลไม่ถูกต้อง")
          .endsWith("@cmu.ac.th", "ต้องเป็นอีเมล @cmu.ac.th"),
      })
    )
    .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
    .max(3, "ผู้สอนต้องไม่เกิน 3 คน")
    .refine(
      (instructors) => {
        const emails = instructors
          .map((i) => i.email.trim().toLowerCase())
          .filter((e) => e !== "");
        return new Set(emails).size === emails.length;
      },
      { message: "อีเมลผู้สอนซ้ำกัน" }
    ),
  emailNotification: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export function createCourseFormSchema(existingCourses: Course[]) {
  return courseFormSchema.refine(
    (data) => !existingCourses.some((c) => c.courseId === data.courseId),
    { message: "รหัสวิชานี้มีอยู่แล้ว", path: ["courseId"] }
  );
}