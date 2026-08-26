"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/teacher",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "邮箱或密码错误" };
    }
    throw error;
  }
}
