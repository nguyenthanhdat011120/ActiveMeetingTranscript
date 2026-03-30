# 🔄 WorkFlowLoop - Active Meeting Transcript

> **"Biến mọi cuộc họp nội bộ thành kết quả công việc, không để lọt quyết định."**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth/DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

---

## 🌟 Giới thiệu (Product Concept)

**WorkFlowLoop** không chỉ là một công cụ ghi âm hay tóm tắt cuộc họp thông thường (AI Note-taker). Đây là một hệ thống **Meeting-to-Execution** toàn diện dành cho các Remote Teams, giúp thu hẹp khoảng cách giữa thảo luận và hành động. 

Hệ thống tự động chuyển đổi audio cuộc họp thành các **Action Items** có người phụ trách (Owner), thời hạn (Deadline) và đồng bộ hóa trực tiếp với các công cụ quản lý công việc như Slack, Notion, Jira.

### 💡 Giá trị cốt lõi
- **Tránh thất thoát quyết định**: Mọi cam kết trong họp đều được AI "bắt" lại chính xác.
- **Tăng tính trách nhiệm**: Tự động nhận diện Owner và Deadline cho từng đầu việc.
- **Tiết kiệm thời gian**: Giảm thời gian viết Recap từ 30 phút xuống còn dưới 2 phút.
- **Minh bạch**: Một nguồn sự thật duy nhất cho mọi quyết định sau họp.

---

## ✨ Tính năng chính (MVP Scope)

1.  🎙️ **Meeting Capture & Transcription**: Ghi âm chất lượng cao và chuyển đổi văn bản (Speech-to-Text) theo thời gian thực.
2.  🤖 **AI-Driven Summary**: Tóm tắt thông minh, phân loại Nội dung chính, Quyết định quan trọng và các Rào cản (Blockers).
3.  ⚡ **Action Item Extraction**: Tự động trích xuất đầu việc từ transcript dựa trên ngữ cảnh cam kết (Ví dụ: "I'll handle this by Friday").
4.  🖥️ **Review & Delegate UI**: Giao diện trực quan để người dùng kiểm duyệt, chỉnh sửa Owner/Deadline trước khi phát hành.
5.  🔌 **Multi-Tool Integration**: Đồng bộ hóa 1-click sang các nền tảng làm việc phổ biến (Notion, Slack, ClickUp, Jira).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend & UI
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Framer Motion (Animations)
- **Components**: Shadcn UI & Lucide Icons
- **Design System**: Digital Curator (Stitch Custom Tokens)

### Backend & Data
- **Language**: TypeScript
- **Database**: PostgreSQL (Managed by Supabase)
- **ORM**: Prisma
- **Auth**: Supabase Auth (Google/GitHub)

### AI & Pipeline
- **STT**: OpenAI Whisper / Groq Whisper
- **LLM**: Claude 3.5 Sonnet / Llama 3.3 (Transcribe & Synthesis)
- **Automation**: n8n / Custom Webhooks

---

## 🚀 Bắt đầu dự án (Local Setup)

### 1. Yêu cầu hệ thống
- Node.js 18+ 
- npm / yarn / pnpm

### 2. Cài đặt Dependencies
```bash
git clone https://github.com/nguyenthanhdat011120/ActiveMeetingTranscript.git
cd ActiveMeetingTranscript
npm install
```

### 3. Cấu hình Biến môi trường
Tạo file `.env.local` từ mẫu sau:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_prisma_db_url
DIRECT_URL=your_prisma_direct_url
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_anthropic_key
```

### 4. Khởi tạo Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Chạy môi trường Dev
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

---

## 📂 Cấu trúc thư mục (Project Structure)

```bash
/app              # Next.js App Router (Routes & Pages)
  ├── (dashboard) # Các trang chức năng chính (Record, Meetings, Insights)
  ├── api         # API Endpoints (Integration, Synthesis, Audio)
  └── auth        # Auth logic & Callbacks
/components       # UI Components (Reusable)
/docs             # Tài liệu chi tiết dự án (PDR, Arch, Roadmap)
/hooks            # Custom React Hooks
/lib              # Shared Utilities (Prisma, Supabase, AI Logic)
/prisma           # Database Schema
/public           # Static Assets (Images, Icons)
```

---

## 📅 Lộ trình phát triển (Roadmap)

- [x] **Phase 1**: Thiết kế UI/UX & Setup Infrastructure.
- [x] **Phase 2**: Thực hiện cơ chế Capture Audio & Real-time Transcription.
- [ ] **Phase 3**: AI Synthesis Engine - Tóm tắt & Trích xuất Action Items.
- [ ] **Phase 4**: Tích hợp One-click Sync (Notion, Slack).
- [ ] **Phase 5**: Pilot Testing & Feedback xử lý nhiễu âm thanh.

---

## 📄 Tài liệu tham khảo

Để biết thêm chi tiết, vui lòng xem trong thư mục `/docs`:
- [Project Overview - PDR](./docs/project-overview-pdr.md)
- [System Architecture](./docs/system-architecture.md)
- [Project Roadmap](./docs/project-roadmap.md)
- [Design Guidelines](./docs/design-guidelines.md)

---

## 🤝 Đóng góp

Mọi đóng góp (Issue, Pull Request) đều được trân trọng. Vui lòng thảo luận trước qua Issue khi có các thay đổi lớn về kiến trúc.

---

**© 2026 WorkFlowLoop by [Nguyen Thanh Dat](https://github.com/nguyenthanhdat011120)**
