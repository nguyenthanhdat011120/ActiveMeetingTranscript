# Project Roadmap - WorkFlowLoop

## Roadmap Phases

- **Phase 0 (Week 1): Validate & Research** - Xác nhận pain point qua User Interviews.
- **Phase 1 (Week 2): MVP Design** - Chốt luồng UI/UX và Database Schema.
- **Phase 2 (Week 3): Core App (Meeting Capture)** - Upload Audio + STT (Whisper).
- **Phase 3 (Week 4): AI Extraction & Review UI** - Summary + Action Items + Editor.
- **Phase 4 (Week 5): Multi-Tool Integration** - Slack/Notion/Jira connectors.
- **Phase 5 (Week 6): Pilot & Feedback** - Team thật dùng, sửa lỗi, tối ưu.
- **Phase 6 (Week 7+): Improve & Pricing** - Onboarding, Billing và Scale.

---

## Weekly Checklist (MVP Build Phase 1-4)

### Week 2: Design & Setup
- [ ] Chốt 5-6 màn hình chính (Dashboard, Meeting Detail, Editor, Integrations).
- [ ] Setup project Next.js + Tailwind + Lucide + Shadcn UI.
- [ ] Thiết lập Database Schema (Prisma/Postgres) và API boilerplate.
- [ ] Tích hợp Authentication (Clerk/Supabase).

### Week 3: Capture & Transcribe
- [ ] Web giao diện Upload audio (MP3/WAV) và Recording UI.
- [ ] Tích hợp API Transcription (OpenAI Whisper / Deepgram).
- [ ] Hiển thị Transcript viewer theo từng speaker hoặc timestamp đơn giản.
- [ ] Lưu trữ file âm thanh và transcript vào DB.

### Week 4: Smart Extraction & Review
- [ ] Prompt Engineering cho LLM (Claude/GPT) để trích xuất JSON: Summary, Decisions, Action Items.
- [ ] Màn hình "Meeting Review": Hiển thị AI output cho phép người dùng sửa trực tiếp.
- [ ] UI Editor: Gán người nhận (Owner) và ngày hết hạn (Due date) cho mỗi action item.

### Week 5: Integrations & Publish
- [ ] Connect Slack: Gửi thông báo recap ngắn gọn vào channel chỉ định.
- [ ] Connect Notion: Tạo page tự động trong database Notion (Meeting log).
- [ ] Connect ClickUp/Jira: Tự động tạo Task từ Action Items đã chốt.
- [ ] Tính năng "One-click Send Recap" hoạt động mượt mà.

### Week 6: Pilot Testing
- [ ] Mời 2-3 team thật dùng thủ trong các buổi họp hàng tuần.
- [ ] Theo dõi lỗi STT và độ chính xác của AI Extraction.
- [ ] Thu thập feedback về tính tiện dụng (UI/UX).
