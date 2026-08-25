import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, GraduationCap, Home, Lightbulb, LogOut, Target, Users } from "lucide-react";

const navItems = [
  { href: "/teacher", label: "首页", icon: Home },
  { href: "/teacher/classes", label: "班级管理", icon: GraduationCap },
  { href: "/teacher/students", label: "学生管理", icon: Users },
  { href: "/teacher/feedback", label: "课堂反馈", icon: BookOpen },
  { href: "/teacher/mistakes", label: "错题管理", icon: Lightbulb },
  { href: "/teacher/plans", label: "学习规划", icon: Target },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full border-r bg-background md:w-64 md:shrink-0">
        <div className="flex h-14 items-center border-b px-4 font-semibold">
          EduFeedback AI
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <nav className="flex flex-col gap-1 p-3 md:p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Separator className="my-2" />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost" className="w-full justify-start gap-3 px-3 text-sm font-medium text-muted-foreground">
                <LogOut className="h-4 w-4" />
                退出登录
              </Button>
            </form>
          </nav>
        </ScrollArea>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="border-b px-4 py-3 md:hidden font-semibold">
          EduFeedback AI
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
