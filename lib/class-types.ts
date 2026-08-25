import { ClassType } from "@prisma/client";

export const classTypeLabels: Record<ClassType, string> = {
  AFTER_SCHOOL: "托管班",
  EXERCISE: "习题班",
  CPP: "C++ 班",
  OLYMPIAD_MATH: "奥数班",
};

export const classTypeOptions = Object.entries(classTypeLabels).map(([value, label]) => ({
  value: value as ClassType,
  label,
}));
