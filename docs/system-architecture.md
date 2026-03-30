# System Architecture - WorkFlowLoop

## Tech Stack (2026 Recommended)
- Frontend: **Next.js** (App Router, Tailwind CSS, Lucide Icons, Shadcn UI). *Confirmed as optimal for 2026 SaaS dashboards.*
- Backend: **Node.js (TypeScript)** / **Python (FastAPI)**.
- Database: **Postgres** (Prisma / Drizzle ORM) + **pgvector** for semantic search.
- STT Optimization (2026): **Gladia** (sub-100ms real-time) or **Deepgram Nova-2** for streaming; **OpenAI Whisper v3** for batch.
- AI Extraction: **Claude 3.5 Sonnet / GPT-4o** with structured output.
- Infrastructure: **Vercel** / **AWS Fargate** for scalability.
- Auth: **Clerk** (Best-in-class friction reduction).

## Database Schema (Postgres)

### Tables

#### 1. `users`
- `id` (uuid, PK)
- `email` (string, unique)
- `name` (string)
- `clerk_id` (string, unique)
- `created_at` (timestamp)

#### 2. `organizations` / `teams`
- `id` (uuid, PK)
- `name` (string)
- `owner_id` (uuid, FK users.id)
- `created_at` (timestamp)

#### 3. `meetings`
- `id` (uuid, PK)
- `team_id` (uuid, FK teams.id)
- `title` (string)
- `date` (timestamp)
- `agenda` (text, optional)
- `audio_url` (string, optional)
- `transcript` (text, optional)
- `summary` (text, optional)
- `status` (enum: 'PENDING', 'TRANSCRIBED', 'PROCESSED', 'PUBLISHED')
- `created_by` (uuid, FK users.id)

#### 4. `action_items`
- `id` (uuid, PK)
- `meeting_id` (uuid, FK meetings.id)
- `title` (string)
- `description` (text, optional)
- `owner_id` (uuid, FK users.id, nullable)
- `due_date` (timestamp, nullable)
- `priority` (enum: 'LOW', 'MEDIUM', 'HIGH')
- `status` (enum: 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED')
- `external_task_id` (string, optional - link to Jira/Notion)

#### 5. `integrations`
- `id` (uuid, PK)
- `team_id` (uuid, FK teams.id)
- `provider` (enum: 'SLACK', 'NOTION', 'CLICKUP', 'JIRA')
- `access_token` (string, encrypted)
- `config` (jsonb)

---

## API Endpoints (MVP)

### Authentication
- `POST /auth/register` - Đăng ký người dùng.
- `POST /auth/login` - Đăng nhập.

### Meetings
- `GET /meetings` - Lấy danh sách cuộc họp của team.
- `GET /meetings/:id` - Lấy chi tiết cuộc họp + transcript + action items.
- `POST /meetings/upload` - Upload audio file và tạo meeting.
- `GET /meetings/:id/process` - Kích hoạt STT và AI Extraction.
- `PATCH /meetings/:id/publish` - Chốt dữ liệu và gửi recap sang các công cụ.

### Action Items
- `POST /action-items` - Tạo action item thủ công.
- `PATCH /action-items/:id` - Cập nhật (Owner, Deadline, Priority, Status).
- `DELETE /action-items/:id` - Xóa action item không hợp lệ.

### Integrations
- `GET /integrations` - Lấy danh sách các công cụ đã kết nối.
- `POST /integrations/:provider/connect` - Kết nối tool qua OAuth.
