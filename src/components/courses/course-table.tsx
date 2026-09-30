import { ConfirmDeleteButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[90px] py-2.5 pl-3 text-xs">รหัสวิชา</TableHead>
            <TableHead className="w-[220px] py-2.5 text-xs">ชื่อวิชา</TableHead>
            <TableHead className="w-[90px] py-2.5 text-center text-xs">หลักสูตร</TableHead>
            <TableHead className="w-[130px] py-2.5 text-xs">ภาคการศึกษา</TableHead>
            {/* ขยายความกว้างช่องรายละเอียด */}
            <TableHead className="w-[360px] py-2.5 text-xs">รายละเอียด</TableHead>
            <TableHead className="w-[200px] py-2.5 text-xs">ผู้สอน</TableHead>
            <TableHead className="w-[140px] py-2.5 text-center text-xs">รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-[70px] py-2.5 pr-3 text-center text-xs">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId} className="align-top">
              {/* 1. รหัสวิชา */}
              <TableCell className="py-3 pl-3 text-sm font-normal text-foreground">
                {course.courseId}
              </TableCell>

              {/* 2. ชื่อวิชา */}
              <TableCell className="py-3 pr-4 text-sm font-normal text-foreground">
                {course.courseTitle}
              </TableCell>

              {/* 3. หลักสูตร ( Badge ) */}
              <TableCell className="py-3 text-center">
                {course.program ? (
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-xs font-normal"
                  >
                    {course.program}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* 4. ภาคการศึกษา */}
              <TableCell className="whitespace-nowrap py-3 text-sm font-normal">
              {(course.semester as string) === "3" || (course.semester as string) === "summer"
                ? "ภาคฤดูร้อน"
                : course.semester
                ? `ภาคการศึกษาที่ ${course.semester}`
                : "—"}
              </TableCell>

              {/* 5. รายละเอียด */}
              <TableCell className="max-w-[360px] break-words whitespace-pre-line py-3 pr-4 text-sm text-muted-foreground">
                {course.description || "—"}
              </TableCell>

              {/* 6. ผู้สอน */}
              <TableCell className="py-3">
                {course.instructors && course.instructors.length > 0 ? (
                  <div className="space-y-1">
                    {course.instructors.map((instructor, idx) => (
                      <div key={idx} className="text-sm leading-snug">
                        <div className="font-medium text-foreground">
                          {instructor.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {instructor.email}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* 7. รับข่าวสารทางอีเมล */}
              <TableCell className="py-3 text-center">
                <Badge
                  variant={course.notifyByEmail ? "default" : "secondary"}
                  className="rounded-full px-3 py-0.5 text-xs font-normal"
                >
                  {course.notifyByEmail ? "รับ" : "ไม่รับ"}
                </Badge>
              </TableCell>

              {/* 8. Action */}
              <TableCell className="py-3 pr-3 text-center">
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}