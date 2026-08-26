# EduFeedback AI - 项目交接文档

> 本文档供后续接手修改的 AI / 开发者阅读。修改前请务必通读本文，避免踩坑。

---

## 1. 项目概述

**项目名称**：EduFeedback AI（教培反馈与 AI 辅助系统）

**目标用户**：教育培训机构（托管班、习题班、C++ 班、奥数班）

**核心定位**：
- 老师端：管理班级、学生、课堂反馈、错题、AI 生成内容
- 家长端：H5 页面查看孩子的反馈、错题、练习、学习规划
- **AI 仅辅助老师，不直接面向学生/家长，不提供自动解题**

**本地路径**：`/Users/huangkang/Documents/kimi-code/edu-feedback-ai`
**GitHub**：https://github.com/HKJackson/edu-feedback-ai

---

## 2. 技术栈与关键版本

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 16.3.2 | App Router，注意不是传统 Next.js |
| React | 19.2.8 | React 19，ref 是 prop，forwardRef 仍可用 |
| TypeScript | 5.x | |
| Tailwind CSS | 4.x | 使用 `@import "tailwindcss"` |
| shadcn/ui | 通过 `npx shadcn@latest` 安装 | 组件在 `components/ui/` |
| Prisma | 7.9.1 | **注意**：Prisma 7 必须使用 driver adapter |
| better-sqlite3 | | Prisma 7 的 SQLite adapter |
| NextAuth.js | v5 beta (Auth.js) | `next-auth@5.0.0-beta.32` |
| bcryptjs | 3.x | 密码哈希 |
| AI | Moonshot (Kimi) | API 地址：`https://api.moonshot.cn/v1/chat/completions` |

### 重要提示：这不是你熟悉的 Next.js

项目根目录有 `AGENTS.md`，是 Next.js 16 自动生成的警告文件：
> "This is NOT the Next.js you know"

Next.js 16 有大量破坏性变更：
- `middleware.ts` 已弃用，推荐使用 `proxy`
- App Router 行为可能与训练数据中的 Next.js 14/15 不同
- 修改前建议查看 `node_modules/next/dist/docs/` 对应文档

---

## 3. 环境变量

复制 `.env.example` 为 `.env`：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="本地开发可随意填写"
NEXTAUTH_URL="http://localhost:3000"
MOONSHOT_API_KEY="你的 Kimi API Key"
```

**生产环境注意**：
- SQLite 不支持 Vercel 等 Serverless 平台
- 生产必须切换为 PostgreSQL + 对应 Prisma adapter（如 `@prisma/adapter-neon`）
- `NEXTAUTH_SECRET` 必须设置为随机长字符串
- `NEXTAUTH_URL` 必须设置为真实域名

---

## 4. 数据库

### 4.1 Prisma 7 的特殊配置

`prisma/schema.prisma` 中 **不能写 `url`**：

```prisma
datasource db {
  provider = "sqlite"
  // 不要在这里写 url！
}
```

数据库连接串写在 `prisma.config.ts`：

```ts
datasource: {
  url: process.env["DATABASE_URL"],
},
```

PrismaClient 必须通过 adapter 初始化，见 `lib/prisma.ts`：

```ts
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
export const prisma = new PrismaClient({ adapter });
```

### 4.2 切换 PostgreSQL 的方法

如果后续要部署到 Vercel，必须：
1. 改 `prisma/schema.prisma`：`provider = "postgresql"`
2. 改 `lib/prisma.ts`：使用 `@prisma/adapter-neon` 或 `@prisma/adapter-pg`
3. 安装对应 adapter 和数据库驱动
4. 改 `DATABASE_URL` 为 PostgreSQL 连接串

### 4.3 常用命令

```bash
# 开发迁移
npx prisma migrate dev

# 生产部署迁移
npx prisma migrate deploy

# 种子数据
npm run db:seed

# 查看数据库
npm run db:studio
```

### 4.4 数据模型概览

- `User`：用户（ADMIN / TEACHER / PARENT）
- `Student`：学生
- `ParentStudent`：家长-学生绑定关系
- `Class`：班级（类型：AFTER_SCHOOL / EXERCISE / CPP / OLYMPIAD_MATH）
- `ClassEnrollment`：学生-班级 enrollment
- `DailyFeedback`：课堂反馈（keyPoints + aiSummary）
- `Mistake`：错题记录（content + aiVariation）
- `Practice`：练习题（来源：MANUAL / AI_VARIATION）
- `LearningPlan`：学习规划

---

## 5. 认证系统

### 5.1 文件分工

- `auth.config.ts`：**Middleware 专用配置**，不能依赖 Prisma/Node.js 模块
- `auth.ts`：完整认证配置，包含 Credentials provider 和 Prisma 查询
- `middleware.ts`：只引用 `auth.config.ts`
- `app/api/auth/[...nextauth]/route.ts`：NextAuth API 路由，引用 `auth.ts`
- `types/next-auth.d.ts`：扩展 session 类型

### 5.2 为什么拆分 auth.config.ts？

因为 Middleware 运行在 Edge Runtime，不支持 Node.js `fs` 模块。如果 Middleware 引用 `auth.ts`，`auth.ts` 会间接加载 `better-sqlite3` -> `fs`，导致运行时错误：

> The edge runtime does not support Node.js 'fs' module.

**务必保持这种拆分**。

### 5.3 登录实现方式

当前登录使用 **Server Action**，而不是客户端 `signIn()`：

- `app/login/actions.ts`：老师登录 server action
- `app/parent/login/actions.ts`：家长登录 server action
- 登录页（client component）调用 server action
- 成功后在服务端直接 `redirectTo`

这样避免了 NextAuth v5 beta 客户端 `signIn` 在 Next.js 16 下的兼容性问题。

### 5.4 默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@edu.local | 123456 |
| 老师 | teacher@edu.local | 123456 |
| 家长 | parent@edu.local | 123456 |

---

## 6. 项目结构

```
edu-feedback-ai/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── feedback-summary/route.ts   # AI 生成反馈总结
│   │   │   ├── learning-plan/route.ts      # AI 生成学习规划
│   │   │   └── mistake-variations/route.ts # AI 生成错题变式
│   │   └── auth/[...nextauth]/route.ts     # NextAuth API 路由
│   ├── login/
│   │   ├── page.tsx                        # 老师登录页
│   │   └── actions.ts                      # 老师登录 server action
│   ├── parent/
│   │   ├── layout.tsx                      # 家长端布局
│   │   ├── login/
│   │   │   ├── page.tsx                    # 家长登录页
│   │   │   └── actions.ts                  # 家长登录 server action
│   │   ├── page.tsx                        # 家长首页（孩子列表）
│   │   └── student/[id]/page.tsx           # 孩子详情（反馈/错题/练习/规划）
│   ├── teacher/
│   │   ├── layout.tsx                      # 老师端侧边栏布局
│   │   ├── page.tsx                        # 老师工作台 Dashboard
│   │   ├── classes/                        # 班级管理
│   │   ├── students/                       # 学生管理
│   │   ├── feedback/                       # 课堂反馈
│   │   ├── mistakes/                       # 错题管理
│   │   └── plans/                          # 学习规划
│   ├── layout.tsx                          # 根布局
│   ├── page.tsx                            # 首页（入口选择）
│   └── globals.css                         # Tailwind 全局样式
├── auth.ts                                 # 完整 NextAuth 配置
├── auth.config.ts                          # Middleware 专用配置
├── middleware.ts                           # 路由保护中间件
├── lib/
│   ├── prisma.ts                           # Prisma 客户端
│   ├── ai.ts                               # AI 调用封装
│   └── class-types.ts                      # 班级类型常量
├── prisma/
│   ├── schema.prisma                       # 数据库模型
│   ├── seed.ts                             # 种子数据
│   └── config.ts                           # Prisma 配置
├── components/ui/                          # shadcn/ui 组件
└── types/next-auth.d.ts                    # NextAuth 类型扩展
```

---

## 7. 已完成功能

- [x] GitHub 仓库创建
- [x] Next.js + TypeScript + Tailwind 初始化
- [x] Prisma + NextAuth + shadcn/ui 配置
- [x] 数据库 Schema 与迁移
- [x] 老师/家长登录与权限控制
- [x] 班级管理（增删改查）
- [x] 学生管理（录入、分班、绑定家长）
- [x] 课堂反馈记录 + AI 生成总结
- [x] 错题登记 + AI 生成变式题
- [x] AI 生成个性化学习规划
- [x] 家长端 H5 查看反馈/错题/练习/规划
- [x] README 文档

---

## 8. 已知问题与注意事项

### 8.1 Middleware 弃用警告

`npm run build` 时会有警告：

> The "middleware" file convention is deprecated. Please use "proxy" instead.

当前功能正常，但未来 Next.js 版本可能需要迁移到 `proxy`。迁移命令：

```bash
npx @next/codemod@canary middleware-to-proxy .
```

### 8.2 shadcn/ui Button 被自定义修改

`components/ui/button.tsx` 不是 shadcn 自动生成的默认版本，而是手动修改以支持 `asChild` 的版本。修改时请注意：

- 已安装 `@radix-ui/react-slot`
- 保留了 `icon-sm` / `icon-xs` size，因为 `dialog.tsx` 和 `sheet.tsx` 依赖它们

### 8.3 AI 功能需要配置 Key

如果不填 `MOONSHOT_API_KEY`，点击 "AI 生成" 会报错。可以在 `lib/ai.ts` 中接入其他模型（通义千问、豆包、OpenAI 等）。

### 8.4 本地数据库文件

`dev.db` 和 `dev.db-journal` 已在 `.gitignore` 中，不会提交到 GitHub。

### 8.5 安全漏洞

`npm audit` 报告有 3 个 high severity vulnerabilities，主要来自依赖库。MVP 阶段可接受，生产前建议处理。

---

## 9. 常见修改场景

### 9.1 添加新页面

1. 在 `app/teacher/` 或 `app/parent/` 下创建目录
2. 如果是受保护页面，Middleware 已按 `/teacher/*` 和 `/parent/*` 自动保护
3. 参考现有页面使用 shadcn/ui 组件

### 9.2 修改数据库模型

1. 修改 `prisma/schema.prisma`
2. 运行 `npx prisma migrate dev --name xxx`
3. 运行 `npx prisma generate`
4. 如果新增模型，在 `prisma/seed.ts` 中补充示例数据（可选）

### 9.3 修改 AI 提示词

编辑 `lib/ai.ts` 中的三个函数：
- `generateFeedbackSummary`
- `generateMistakeVariations`
- `generateLearningPlan`

### 9.4 接入其他 AI 模型

修改 `lib/ai.ts`，替换 `fetch` 的目标 URL 和请求体格式。注意保持函数签名不变。

### 9.5 添加 shadcn/ui 组件

```bash
npx shadcn@latest add <component-name>
```

---

## 10. 后续建议（按优先级）

### 高优先级
- [ ] 部署到 Vercel + 切换 PostgreSQL
- [ ] 接入微信小程序（需要企业认证 300 元/年）
- [ ] 图片上传功能（作业照片、课堂照片）
- [ ] 消息通知（新反馈/新练习通知家长）

### 中优先级
- [ ] 学生端（仅查看练习，无 AI 解题）
- [ ] 多校区支持
- [ ] 课消记录
- [ ] 老师权限细分

### 低优先级
- [ ] 缴费管理
- [ ] 数据导出 Excel
- [ ] 仪表盘统计图表

---

## 11. 测试清单

每次修改后建议验证：

- [ ] `npm run build` 通过
- [ ] 老师登录：`teacher@edu.local` / `123456`
- [ ] 家长登录：`parent@edu.local` / `123456`
- [ ] 创建班级、学生、反馈、错题
- [ ] AI 生成功能（需配置 MOONSHOT_API_KEY）
- [ ] 家长端能查看对应学生的数据

---

## 12. 联系方式/备注

- 当前项目处于 MVP 阶段，以功能验证为主
- 代码风格遵循现有文件惯例
- 修改尽量保持最小范围，避免大面积重构
- 所有 AI 生成内容必须经过老师确认后才展示给家长
