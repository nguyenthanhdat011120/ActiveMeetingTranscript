# WorkFlowLoop

> "Biến mọi cuộc họp nội bộ thành kết quả công việc, không để lọt quyết định."

**WorkFlowLoop** là một hệ thống (Meeting-to-Execution) dành cho các Remote Team, tập trung vào việc biến audio cuộc họp thành Action Items có người phụ trách, thời hạn và đồng bộ sang Slack, Notion, Jira.

---

## 🚀 Project Documentation

Toàn bộ tài liệu chi tiết của dự án được lưu trữ trong thư mục `/docs`:

- **[Project Overview - PDR](file:///d:/WorkFlowLoop/docs/project-overview-pdr.md)**: Tổng quan sản phẩm, giá trị lõi, bài toán giải quyết và phạm vi MVP.
- **[System Architecture](file:///d:/WorkFlowLoop/docs/system-architecture.md)**: Chi tiết cơ sở dữ liệu (Database Schema), API Endpoints và Tech Stack khuyên dùng.
- **[Project Roadmap](file:///d:/WorkFlowLoop/docs/project-roadmap.md)**: Lộ trình phát triển qua từng Phase và Checklist công việc theo tuần cho MVP.
- **[Design Guidelines](file:///d:/WorkFlowLoop/docs/design-guidelines.md)**: Mô tả chi tiết các màn hình quan trọng (MVP Screens) và phong cách UI/UX.

---

## 🛠️ Stack Khuyên Dùng (MVP)

- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide, Shadcn UI.
- **Backend/DB**: Node.js/TypeScript, Prisma, Postgres.
- **AI/STT**: OpenAI Whisper, Claude 3.5 Sonnet / GPT-4o.
- **Auth**: Clerk / Supabase.
- **Automation**: n8n, Webhooks.

---

## 📅 Roadmap Tóm Tắt (7 Weeks)

1. **Week 1**: Validate & Research (Phase 0).
2. **Week 2**: MVP Design & Setup (Phase 1).
3. **Week 3**: Capture & Transcribe (Phase 2).
4. **Week 4**: Smart Extraction & AI Review (Phase 3).
5. **Week 5**: Automation & Integrations (Phase 4).
6. **Week 6**: Pilot Testing & Feedback (Phase 5).
7. **Week 7**: Monetization & Launch (Phase 6).

---

## 📂 Project Structure

```bash
/docs
  ├── project-overview-pdr.md    # Product Strategy & POV
  ├── system-architecture.md     # DB Schema, API & Stack
  ├── project-roadmap.md         # Weekly Checklist & Phases
  ├── design-guidelines.md       # MVP Screens & UI Style
README.md                        # Project Entry Point
plan.md                          # Original Plan
phrase.md                        # Original Phases
remote_team_meeting_plan.csv      
```

## 🛠 Database & Authentication (Supabase)

WorkFlowLoop uses **Supabase** (Postgres + Auth) for secure data persistence.

### 1. Provision Sub-space (Supabase)
- Create a project on [Supabase.com](https://supabase.com).
- Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

### 2. Configure Prisma connection
- Copy the Connection String from Project Settings > Database.
- Add `DATABASE_URL` and `DIRECT_URL` (for migrations) to `.env.local`.

### 3. Initialize Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Enable Google/Github Auth
- Go to Authentication > Providers and enable your preferred login protocol.
- Set the redirect URL to: `https://your-domain.ai/auth/callback`
