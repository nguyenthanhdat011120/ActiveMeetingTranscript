# Design Guidelines - WorkFlowLoop (Full Product UI/UX)

## MANDATORY RULE: Mobile-First Strategy
- **Ưu tiên Mobile**: Mọi thiết kế phải bắt đầu từ màn hình di động (Mobile) trước khi mở rộng lên Tablet và Desktop.
- **Touch-Friendly**: Các nút bấm (CTA), menu và thanh điều hướng phải được tối ưu cho tương tác chạm (min 44x44px target).
- **Infinite Scroll & Swipe**: Sử dụng cuộn vô hạn cho danh sách cuộc họp và cử chỉ vuốt (Swipe) để thực hiện nhanh hành động (ghi chú, xóa, gán tag).
- **Responsive Flow**: Tự động chuyển đổi từ Layout đơn cột (Mobile) sang Bento/Split-Pane (Desktop) một cách mượt mà.

## Visual Design Highlights (The Kinetic Neon 2026)
- **Bento Grid Layout**: Cấu trúc Bento (ô đa kích thước) với hiệu ứng Neon Glow mỏng bao quanh các Cell quan trọng.
- **High-Contrast Dark Mode**: Nền đen tuyệt đối (Pure Black) kết hợp với các tấm card xám sâu (Deep Gray) để tạo độ nổi khối.
- **Neon Lime Accent**: Sử dụng màu Xanh Lime Neon (#84FF33) làm điểm nhấn chính cho CTA, biểu đồ và trạng thái hoạt động.
- **Glassmorphism (Dark Variant)**: Các tấm card sử dụng hiệu ứng kính mờ tối (Dark Blur) trên nền Pure Black.
- **Kinetic Waveform**: Sóng âm thanh màu Lime chuyển động sống động.

## Color & Aesthetic (Neon Vortex)
- **Primary Color**: **Neon Lime (#84FF33)** – đầy năng lượng và mang hơi hướng tương lai.
- **Secondary Colors**: Pure White, Silver (#A0A0A0), Slate-400.
- **Background**: **Dark Mode (Default)**: Pure Black (#000000) phối hợp với Deep Charcoal (#121212).
- **Typography**: **Outfit** hoặc **Plus Jakarta Sans** (Fonts sắc nét, hiện đại).
- **Rounding**: **High Rounding (24px)** cho sự thân thiện hoặc **Sharp (4px)** cho sự chuyên nghiệp (chọn 24px cho flow mềm mại).

---

## 🏗️ Detailed Screen Specifications

### 1. Landing Page
- **Hero section**: Big bold "Value Proposition" + Subhead. Visual Mockup of the app dashboard on the right.
- **CTA**: "Get Started Free" button (Indigo).
- **Social Proof**: Logosection + Client Testimonials.
- **Feature Cards**: 
    - AI-Driven Insight extraction.
    - Multi-tool sync (Slack/Notion).
    - Team Accountability Dashboard.
- **How it works**: 3-step vertical or horizontal flow.
- **Pricing Preview**: 3 tiers (Free, Pro, Enterprise).

### 2. Auth Page (Login/Sign Up)
- **Minimalist**: Logo centered, single focus form.
- **Options**: Email/Password + Google OAuth (Google sign-in).
- **UX**: Toggle link between Login/Signup, "Forgot Password" link.
- **States**: Loading indicators, descriptive Error States.

### 3. Onboarding Page
- **Stepper**: 4-step progress bar (Team > Meetings > Output > Integrations).
- **Setup**: Team size, Type of meetings (Standup, 1:1, Planning).
- **Output Choice**: List vs Summary vs Checklist.
- **Integration Prompt**: "Connect your Slack or Notion now".

### 4. Dashboard Page (SaaS Modular)
- **Sidebar**: Dashboard, Meetings, Tasks, Integration, Settings.
- **Topbar**: Global Search, Notification bell, User profile.
- **KPI Cards**: Meetings this week, Pending actions, Sync status.
- **Recent Meetings**: Table/List with Filters (Date, Team).
- **Side Widget**: "Open Action Items" + "Upcoming Meetings".

### 5. Meeting Detail Page (Split Pane Viewer)
- **Metadata**: Title, Date, Duration, Attendee list.
- **Col 1 (Transcript)**: Scrollable dialogue with Speaker ID, Timestamps, and Search.
- **Col 2 (Summary/Decisions)**: AI Generated summaries, Decision points log.
- **Col 3 (Action Items)**: The editable list of tasks.
- **Actions**: Share (Shortlink), Export (Notion/PDF), Comment.

### 6. Record or Upload Page
- **Entry Points**: Big "Record" button vs "Drag & Drop File Upload".
- **Source Sync**: Connect Google Meet / Zoom / Microsoft Teams button.
- **Status UI**: "Transcribing...", "Analyzing...", "Drafting Action Items...".
- **Preview**: Basic audio waveform player.

### 7. Review & Delegate UI
- **Editable Table**: Title, Owner (selection), Due Date (picker), Priority (badge).
- **Workflow**: Checkbox to Approve/Reject each item. "Split Action" or "Merge" buttons.
- **Publish**: "Send Recap to Team" button with preview of the Slack/Email message.

### 8. Integrations Page
- **Grid Layout**: Icon, Name, Connect/Disconnect button.
- **Setup**: Configuration for each (Folder ID for Notion, Channel for Slack).
- **Logs**: "Last Sync: 5 mins ago - Success".

### 9. Settings & Billing Page
- **Tabs**: Profile, Workspace, Members, Billing, Notifications.
- **Management**: User Roles & Permissions, Invoice history.
- **Preferences**: Data retention, Language (VN/EN).

---

## Design Principles (2026 SaaS)
- **Constraint**: **Mobile-First Only** (Xây dựng và kiểm thử trên mobile trước khi mở rộng).
- **Mode**: Light Mode first, Dark Mode as toggle.
- **Aesthetic**: Clean SaaS, "Low Light" accents, Modular Cards.
- **Components**: Rounded corners (24px for big containers), Strong Indigo primary color.
- **UX**: Swipe to action, Touch-optimized, Bottom-navigation on mobile.

## 🎨 Component Design Specs
- **Table**: Clean rows, no heavy borders, padding `p-4`, hover state `bg-slate-50`.
- **Modals**: Minimal usage, only for high-risk actions (Delete).
- **Input**: Focus ring indigo-500, placeholder slate-400.
