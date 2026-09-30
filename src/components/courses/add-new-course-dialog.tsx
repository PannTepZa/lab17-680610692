import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, RotateCcw, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import {
  createCourseFormSchema,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
import type { Course } from "@/lib/types";

const emptyCourseForm: DefaultValues<CourseFormValues> = {
  courseId: "",
  courseTitle: "",
  curriculum: "",
  semester: "" as unknown as CourseFormValues["semester"],
  description: "",
  instructors: [{ name: "", email: "" }],
  emailNotification: false,
};

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => createCourseFormSchema(courses), [courses]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyCourseForm,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructors",
  });

  // ใช้ useWatch แทน form.watch เพื่อป้องกันปัญหากับ React Compiler
  const watchedDescription = useWatch({
    control: form.control,
    name: "description",
  });

  const descriptionValue = watchedDescription || "";
  const isDescriptionExceeded = descriptionValue.length > 100;

  const resetForm = () => {
    form.reset(emptyCourseForm);
  };

  function onSubmit(values: CourseFormValues) {
    const program = values.curriculum.startsWith("CPE") ? "CPE" : "ISNE";

    // กำหนด Type ให้ชัดเจนเป็น Course เพื่อระบุ Type แทนการใช้ as any
    const formattedCourse: Course = {
      courseId: values.courseId,
      courseTitle: values.courseTitle,
      program: program,
      semester: values.semester as Course["semester"],
      description: values.description,
      instructors: values.instructors,
      notifyByEmail: Boolean(values.emailNotification),
    };

    addCourse(formattedCourse);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว ใส่อีเมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100 ตัวอักษร แล้วกดบันทึก
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            {/* 1. รหัสวิชา และ ชื่อวิชา */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Controller
                name="courseId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="courseId">รหัสวิชา</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="courseId"
                        placeholder="เช่น 261305"
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="courseTitle"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="sm:col-span-2"
                  >
                    <FieldLabel htmlFor="courseTitle">ชื่อวิชา</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="courseTitle"
                        placeholder="เช่น Mobile Application Development"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            {/* 2. หลักสูตร */}
            <Controller
              name="curriculum"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="curriculum">หลักสูตร</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        id="curriculum"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="เลือกหลักสูตร" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPE — วิศวกรรมคอมพิวเตอร์">
                          CPE — วิศวกรรมคอมพิวเตอร์
                        </SelectItem>
                        <SelectItem value="ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย">
                          ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            {/* 3. ภาคการศึกษา */}
            <Controller
              name="semester"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-foreground">ภาคการศึกษา</FieldLabel>
                  <FieldContent className="space-y-2">
                    <RadioGroup
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                      className="flex flex-wrap gap-4 pt-1"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="1"
                          id="sem-1"
                          aria-invalid={fieldState.invalid}
                          className={
                            fieldState.invalid
                              ? "border-destructive text-destructive aria-invalid:border-destructive"
                              : ""
                          }
                        />
                        <Label
                          htmlFor="sem-1"
                          className={`cursor-pointer ${
                            fieldState.invalid ? "text-destructive" : ""
                          }`}
                        >
                          ภาคการศึกษาที่ 1
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="2"
                          id="sem-2"
                          aria-invalid={fieldState.invalid}
                          className={
                            fieldState.invalid
                              ? "border-destructive text-destructive aria-invalid:border-destructive"
                              : ""
                          }
                        />
                        <Label
                          htmlFor="sem-2"
                          className={`cursor-pointer ${
                            fieldState.invalid ? "text-destructive" : ""
                          }`}
                        >
                          ภาคการศึกษาที่ 2
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="summer"
                          id="sem-summer"
                          aria-invalid={fieldState.invalid}
                          className={
                            fieldState.invalid
                              ? "border-destructive text-destructive aria-invalid:border-destructive"
                              : ""
                          }
                        />
                        <Label
                          htmlFor="sem-summer"
                          className={`cursor-pointer ${
                            fieldState.invalid ? "text-destructive" : ""
                          }`}
                        >
                          ภาคฤดูร้อน
                        </Label>
                      </div>
                    </RadioGroup>
                    {fieldState.invalid && (
                      <div className="pt-1">
                        <FieldError errors={[fieldState.error]} />
                      </div>
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            {/* 4. รายละเอียด (ไม่บังคับ) */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    รายละเอียด (ไม่บังคับ)
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      {...field}
                      id="description"
                      rows={3}
                      placeholder="คำอธิบายรายวิชาสั้นๆ"
                      aria-invalid={fieldState.invalid}
                    />
                    <div
                      className={`text-sm leading-normal mt-1 transition-colors ${
                        isDescriptionExceeded
                          ? "text-destructive font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {descriptionValue.length}/100 ตัวอักษร
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            {/* 5. ข้อมูลผู้สอน */}
            <div className="grid gap-2">
              <div>
                <FieldLabel htmlFor="instructors">ผู้สอน</FieldLabel>
                <p className="text-sm text-muted-foreground leading-normal mt-0.5">
                  {fields.length}/3 คน — กรอกชื่อผู้สอน และอีเมล name@cmu.ac.th (ห้ามซ้ำกัน)
                </p>
              </div>

              <div className="grid gap-3">
                {fields.map((fieldItem, index) => (
                  <div key={fieldItem.id} className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal text-muted-foreground w-4">
                        {index + 1}.
                      </span>

                      {/* ชื่อผู้สอน */}
                      <Controller
                        name={`instructors.${index}.name`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div className="flex-1">
                            <Input
                              {...field}
                              placeholder="กรอกชื่อผู้สอน"
                              aria-invalid={fieldState.invalid}
                            />
                          </div>
                        )}
                      />

                      {/* อีเมลผู้สอน */}
                      <Controller
                        name={`instructors.${index}.email`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div className="flex-1">
                            <Input
                              {...field}
                              placeholder="name@cmu.ac.th"
                              aria-invalid={fieldState.invalid}
                            />
                          </div>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* แสดง Error รายช่อง */}
                    <div className="pl-6 grid grid-cols-2 gap-2">
                      <div>
                        {form.formState.errors.instructors?.[index]?.name && (
                          <FieldError
                            errors={[
                              form.formState.errors.instructors[index]?.name,
                            ]}
                          />
                        )}
                      </div>
                      <div>
                        {form.formState.errors.instructors?.[index]?.email && (
                          <FieldError
                            errors={[
                              form.formState.errors.instructors[index]?.email,
                            ]}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {form.formState.errors.instructors?.root && (
                  <FieldError
                    errors={[form.formState.errors.instructors.root]}
                  />
                )}
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", email: "" })}
                  disabled={fields.length >= 3}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  เพิ่มผู้สอน
                </Button>
              </div>
            </div>

            {/* 6. รับข่าวสารทางอีเมล */}
            <Controller
              name="emailNotification"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-input p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="email-notification"
                      className="text-sm font-medium cursor-pointer"
                    >
                      รับข่าวสารทางอีเมล
                    </Label>
                    <p className="text-sm text-muted-foreground leading-normal">
                      แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                    </p>
                  </div>
                  <Switch
                    id="email-notification"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </FieldGroup>

          {/* Footer ปุ่มล้างฟอร์ม + ปุ่มบันทึก */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}