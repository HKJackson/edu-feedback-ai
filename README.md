# EduFeedback AI - 教培反馈与 AI 辅助系统

为托管班、习题班、C++ 班、奥数班等教育培训机构打造的课堂反馈、错题管理与 AI 辅助系统。

## 核心功能

### 老师端（PC / 平板）
- **班级管理**：创建托管班、习题班、C++ 班、奥数班
- **学生管理**：录入学生、分班、绑定家长账号
- **课堂反馈**：记录课堂要点，AI 一键生成完整家长反馈文案
- **错题管理**：登记错题，AI 生成同类变式练习题
- **学习规划**：基于学生反馈和错题，AI 生成个性化阶段学习规划

### 家长端（H5，微信浏览器打开）
- 查看孩子的课堂反馈
- 查看错题记录
- 查看老师发布的练习题
- 查看 AI 生成的学习规划

### AI 使用原则
- **AI 不直接面向学生/家长**
- 所有 AI 生成内容需老师确认后才发布
- 解题功能由老师完成，系统不提供自动解题

## 技术栈

- **框架**：Next.js 16 + React 19 + TypeScript
- **UI**：Tailwind CSS 4 + shadcn/ui
- **数据库**：Prisma 7 + SQLite（本地开发）/ PostgreSQL（生产部署）
- **认证**：NextAuth.js v5 (Auth.js)
- **AI**：Moonshot AI (Kimi) API
- **部署**：Vercel

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/HKJackson/edu-feedback-ai.git
cd edu-feedback-ai
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="本地开发可随意填写"
NEXTAUTH_URL="http://localhost:3000"
MOONSHOT_API_KEY="你的 Kimi API Key"
```

> 获取 Moonshot API Key：[https://platform.moonshot.cn/](https://platform.moonshot.cn/)

### 4. 初始化数据库并写入示例数据

```bash
npx prisma migrate dev
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@edu.local | 123456 |
| 老师 | teacher@edu.local | 123456 |
| 家长 | parent@edu.local | 123456 |

## 生产部署（Vercel）

### 数据库选择

本地使用 SQLite，但 Vercel 等 Serverless 平台不支持文件型 SQLite，因此生产环境建议切换到 **PostgreSQL**。

推荐免费方案：
- [Neon](https://neon.tech/)（免费 PostgreSQL）
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Prisma Postgres](https://www.prisma.io/postgres)

### 切换为 PostgreSQL

1. 修改 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
}
```

2. 修改 `lib/prisma.ts`：

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const neonPool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(neonPool);

export const prisma = new PrismaClient({ adapter });
```

3. 安装依赖：

```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
npm install -D @types/ws
```

4. 更新 `.env` 中的 `DATABASE_URL` 为 PostgreSQL 连接串

### Vercel 部署步骤

1. 在 [Vercel](https://vercel.com/) 导入 GitHub 仓库
2. 添加环境变量：
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`（随机长字符串）
   - `NEXTAUTH_URL`（你的 Vercel 域名）
   - `MOONSHOT_API_KEY`
3. 执行数据库迁移：

```bash
npx prisma migrate deploy
```

4. 重新部署

## 项目结构

```
app/
  api/ai/              # AI API 路由
  login/               # 老师登录
  parent/              # 家长端
  teacher/             # 老师端
components/ui/         # shadcn/ui 组件
lib/
  ai.ts                # AI 调用封装
  prisma.ts            # Prisma 客户端
  class-types.ts       # 班级类型常量
prisma/
  schema.prisma        # 数据库模型
  seed.ts              # 示例数据
auth.ts                # NextAuth 配置
```

## 后续可扩展

- [ ] 接入微信小程序（需 300 元/年企业认证）
- [ ] 图片上传（作业照片、课堂照片）
- [ ] 消息通知（微信模板消息 / 短信）
- [ ] 多校区支持
- [ ] 课消与缴费管理
- [ ] 学生端（仅查看练习，无 AI 解题）

## 许可证

MIT
