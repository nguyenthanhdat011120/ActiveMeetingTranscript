# Project Overview - WorkFlowLoop

## Product Concept
**WorkFlowLoop** là một "meeting-to-execution system" dành riêng cho các **Remote Team và Internal Meetings**. Thay vì chỉ là một công cụ ghi chép (AI note-taker) thông thường, WorkFlowLoop tập trung vào việc biến nội dung cuộc họp thành các hành động cụ thể (Action Items) có người phụ trách (Owner), thời hạn (Deadline) và trạng thái theo dõi (Status).

## Core Value Proposition (CVP)
"Biến mọi cuộc họp nội bộ thành kết quả công việc, không để lọt quyết định."

## Problem Statement
Các nhóm làm việc từ xa (Remote Teams) thường xuyên họp nội bộ để chốt phương án và phân công việc. Tuy nhiên:
- Quyết định trong họp dễ bị quên hoặc hiểu sai.
- Action items bị rơi rớt, không có ai ghi chép chính xác.
- Follow-up thủ công tốn thời gian (viết recap, tag từng người trên Slack/Jira).
- Thiếu tính minh bạch và trách nhiệm giải trình sau họp.

## Target Audience
- Remote Teams (Development, Marketing, Product).
- Nhóm họp thường xuyên (Daily Standups, Sprint Planning, Retrospective).
- Manager muốn kiểm soát tiến độ mà không cần micromanage.

## MVP Features Scope
1. **Meeting Capture & Transcription**: Ghi âm và chuyển đổi thành văn bản (STT).
2. **AI-Driven Summary**: Tóm tắt nội dung chính, quyết định và blocker.
3. **Action Item Extraction**: Tự động trích xuất đầu việc từ transcript.
4. **Review & Delegate UI**: Giao diện để người dùng chỉnh sửa Owner, Deadline, Priority trước khi phát hành.
5. **Multi-Tool Integration**: One-click export recap và task sang Slack, Notion, ClickUp, Jira.

## AI Extraction Best Practices (2026 Edition)
- **Human-in-the-loop**: AI không thay thế con người, mà là trợ thủ tổ chức. Người dùng luôn có quyền chốt và sửa kết quả AI cuối cùng.
- **Explicit Ownership & Deadlines**: AI được huấn luyện để nhận diện các cam kết bằng lời nói trực tiếp (VD: "I'll handle this by Friday"). Hệ thống sẽ tự động bắt lấy các triggers này.
- **Verification Workflow**: Mọi Action Item do AI trích xuất đều ở trạng thái "Suggested" cho đến khi được con người duyệt qua màn hình Review.
- **Contextual Summary**: Tóm tắt không chỉ liệt kê, mà còn chỉ ra "Why" và "Next Step" của từng mục thảo luận.

## Success Metrics (MVP)
- Tỷ lệ action items được gán Owner/Deadline thực tế.
- Độ chính xác của AI Extraction (người dùng không cần sửa quá 20% nội dung).
- Số lượng tích hợp (Slack/Notion) được sử dụng thường xuyên.
- Thời gian tiết kiệm được cho việc viết recap sau họp (giảm từ 15-30p xuống còn <2p).
