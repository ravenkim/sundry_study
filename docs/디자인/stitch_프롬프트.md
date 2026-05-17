# EcoReport — Stitch 화면 생성 프롬프트 모음

> Google Stitch(stitch.withgoogle.com)에서 화면별로 아래 프롬프트를 복사·붙여넣기 하세요.  
> 공통 스타일 컨텍스트를 먼저 입력하고, 이후 각 화면 프롬프트를 사용하세요.

---

## 공통 스타일 컨텍스트 (모든 화면에 앞서 먼저 입력)

```
Design a mobile app screen for "EcoReport" (에코리포트), a Korean campus energy waste reporting app.

Design system:
- Font: Pretendard (Korean-optimized sans-serif)
- Primary color: #FFC107 (Volt Yellow) — used for CTA buttons, points display
- Secondary color: #4CAF50 (Eco Green) — used for savings data, success states
- Background: #F5F5F5 (page), #FFFFFF (cards)
- Text: #1A1A1A (primary), #555555 (secondary), #AAAAAA (disabled)
- Border: #E0E0E0
- Error: #D32F2F

Component specs:
- Cards: border-radius 12px, shadow "0 1px 4px rgba(0,0,0,0.08)", border 1px solid #E0E0E0, padding 16px
- Primary button: bg #FFC107, text #1A1A1A, height 48px, border-radius 8px (large CTA: 56px height)
- Secondary button: bg #4CAF50, text #FFFFFF, height 48px, border-radius 8px
- Ghost button: transparent bg, border 1px solid #FFC107, text #FFC107
- Status badge (pill shape): height 24px, border-radius 100px
  - Approved: bg #E8F5E9, text #2E7D32
  - Rejected: bg #FFEBEE, text #C62828
  - Pending: bg #E3F2FD, text #1565C0
  - Undetectable: bg #FFFDE7, text #FF8F00
- Input field: height 48px, border-radius 8px, border 1px solid #E0E0E0; focused: 2px solid #FFC107
- Points number: 32px bold, color #FF8F00
- Savings number: 32px bold, color #388E3C
- Icons: Material Symbols Outlined style, 24px

Layout: Mobile-first, max content width 390px (iPhone 14 standard), 16px side margins, 4px grid spacing system.
App bar at top, bottom navigation bar with 4 tabs: Home, History, Points, My.
Korean UI language.
```

---

## Screen 01 — 홈 (메인 화면)

```
Design the Home screen of EcoReport mobile app using the design system described above.

Screen content:
- Top app bar: "🌱 에코리포트" title on left, notification bell icon on right
- Campus energy savings card (full-width, green theme):
  - Title: "이번 달 캠퍼스 절약량" (body-2, #555555)
  - Large number: "🌿 243 kWh" (32px bold, #388E3C)
  - Subtitle: "🌲 소나무 12그루 흡수량과 동등" (12px, #4CAF50)
  - Card background: #E8F5E9, border-radius 12px
- My points row: "내 포인트 ⚡ 320 P" with small lightning bolt icon, color #FF8F00, 20px bold
- PRIMARY CTA button — very prominent, full-width, tall (56px):
  - "📷 낭비 제보하기" text
  - Background: #FFC107, text: #1A1A1A, bold
  - Slight yellow glow shadow
- Recent reports section title: "최근 제보 현황"
- Two report summary cards stacked:
  - Card 1: "공학관 A동 303호" | "조명 켜짐" | "+50P" badge in yellow | "승인됨" status badge in green
  - Card 2: "도서관 2층 열람실" | "에어컨 켜짐" | "+30P" badge in yellow | "검토 중" status badge in blue
- Bottom navigation bar with 4 tabs (Home selected/highlighted in #FFC107): 홈, 제보이력, 포인트, 마이

Mood: Clean, energetic, motivating. The report button should feel like the most important element.
```

---

## Screen 02-A — 제보 플로우: 사진 촬영

```
Design the photo capture screen (Step 1 of 3) for reporting energy waste in EcoReport mobile app.

Screen content:
- Top bar: back arrow "←" on left, "제보하기" title centered, step indicator "1/3" on right
- Step progress bar at top: 3 segments, first segment filled with #FFC107
- Main area: large camera viewfinder taking up ~60% of screen height
  - Dark overlay with rounded corners (16px)
  - Camera guide frame (dashed white rectangle) in center with corner markers
  - Instruction text inside: "강의실 전체가 나오도록 촬영해주세요" in white, 14px
- Bottom controls area:
  - Center: large circular shutter button (64px diameter, #FFC107 background, camera icon inside)
  - Below shutter: "또는 갤러리에서 선택" text link in #555555, underlined
- Tips card at very bottom (collapsible, subtle):
  - "💡 조명·에어컨이 보이게 찍으면 더 잘 인식돼요" in #FF8F00, small card with yellow-50 background

Mood: Camera-focused, clear guidance, the shutter button dominant.
```

---

## Screen 02-B — 제보 플로우: 위치 선택

```
Design the location tagging screen (Step 2 of 3) for EcoReport mobile app.

Screen content:
- Top bar: back arrow "←", "위치 선택" title centered, step indicator "2/3" on right
- Step progress bar: 2/3 segments filled with #FFC107
- Photo preview: small thumbnail of captured photo in top-right area (80x80px, rounded 8px)
- Form section:
  - Label "건물 선택" (14px, #555555)
  - Dropdown select field: "공학관 A동 ▼", height 48px, border 1px solid #FFC107 (focused state), rounded 8px
  - Spacer (16px)
  - Label "강의실 선택" (14px, #555555)
  - Dropdown select field: "303호 ▼", height 48px, border 1px solid #E0E0E0, rounded 8px
  - Helper text below: "수업 중인 강의실 제보는 반려될 수 있어요" in #AAAAAA, 12px
- Bottom: full-width primary button "제출하기" (#FFC107, #1A1A1A text, 56px height)

Mood: Form-focused, clear and simple, easy to fill in.
```

---

## Screen 02-C — 제보 결과: 성공

```
Design the success result screen after AI judgment in EcoReport mobile app.

Screen content:
- Centered layout, celebratory feel
- Large success icon area (top 40% of screen):
  - Big animated checkmark circle: #4CAF50 background, white checkmark, 80px diameter
  - Subtle green confetti or sparkle elements around it
- Result text (centered):
  - "낭비 확인됨! 🎉" heading (28px bold, #1A1A1A)
  - "조명 켜짐 감지" sub-label (16px, #555555)
- Points earned card (centered, yellow theme):
  - "+ 50 포인트 적립!" (40px bold, #FF8F00)
  - Background: #FFF9C4, border-radius 12px, padding 20px 32px
- Accumulated points row:
  - "누적 포인트: ⚡ 370 P" (16px, #555555 label + #FF8F00 value)
- Bottom two buttons side by side:
  - Ghost button (50% width): "홈으로" border #FFC107
  - Primary button (50% width): "또 제보하기" bg #FFC107

Mood: Celebratory, rewarding, encouraging repeat behavior.
```

---

## Screen 02-D — 제보 결과: 판별 불가

```
Design the "undetectable" result screen for EcoReport mobile app when AI cannot confirm energy waste.

Screen content:
- Centered layout
- Large warning icon: yellow circle background (#FFFDE7), "?" or camera-off icon in #FF8F00, 80px diameter
- Result text (centered):
  - "판별이 어려웠어요" heading (28px bold, #1A1A1A)
  - "조명이나 에어컨이 사진에 잘 보이지 않았어요" body text (14px, #555555)
- Tips card:
  - Title: "이렇게 찍으면 더 잘 돼요" (#FF8F00, 14px bold)
  - Bullet list:
    - "📸 강의실 전체가 나오도록"
    - "💡 조명·에어컨이 화면에 포함되도록"
    - "🌅 역광 없는 밝은 곳에서"
  - Card background: #FFFDE7, border-radius 12px
- Status badge: "재촬영 필요" pill badge, bg #FFFDE7, text #FF8F00
- Bottom two buttons:
  - Ghost button: "홈으로" border #E0E0E0, text #555555
  - Primary button: "다시 촬영하기" bg #FFC107

Mood: Gentle failure, encouraging retry, no blame on user.
```

---

## Screen 03 — 포인트 탭

```
Design the Points tab screen for EcoReport mobile app.

Screen content:
- Top app bar: "포인트" title
- Current balance card (full-width, prominent):
  - Label: "현재 보유 포인트" (14px, #555555)
  - Large number: "⚡ 370 P" (48px bold, #FF8F00)
  - Two stats below in row:
    - "이번 달 획득 +220P" (green #4CAF50)
    - "총 누적 1,240P" (#555555)
  - Card: white background, shadow, border-radius 12px
- Section divider: "── 포인트 교환하기 ──" (#AAAAAA, 12px, centered)
- Reward list (vertical scroll):
  - Reward Card 1:
    - Left: coffee cup icon (circular 48px, bg #FFF9C4)
    - Center: "스타벅스 아메리카노" (16px bold) + "스타벅스" (12px, #555555)
    - Right: "500P" (#FF8F00, 16px bold) + "교환" button (small, #4CAF50 bg, white text, 32px height)
  - Reward Card 2:
    - Left: convenience store icon (circular 48px, bg #E8F5E9)
    - Center: "GS25 상품권 1천원" (16px bold) + "GS25" (12px, #555555)
    - Right: "300P" (#FF8F00) + "교환" button
  - Reward Card 3 (insufficient points, grayed):
    - Left: star icon (circular 48px, bg #F5F5F5)
    - Center: "학식 포인트 교환" (16px, #AAAAAA) + "대학 연동" badge
    - Right: "1P = 1원" (#AAAAAA) + "교환" button (disabled, bg #E0E0E0)
- Bottom navigation bar (포인트 tab selected)

Mood: Rewarding, clear value display, motivating exchange section.
```

---

## Screen 04 — 제보 이력

```
Design the Report History tab screen for EcoReport mobile app.

Screen content:
- Top app bar: "제보 이력"
- Filter tabs row (horizontally scrollable pills):
  - "전체" (selected, bg #FFC107, text #1A1A1A)
  - "승인됨" (unselected, border #E0E0E0)
  - "처리중" (unselected)
  - "반려" (unselected)
- Report cards list (vertical scroll):
  - Card 1 (Approved):
    - Top row: "공학관 A동 303호" (16px bold) + "승인됨" badge (green pill)
    - Second row: "🔆 조명 켜짐 감지" (#555555, 14px) 
    - Third row: "+50P" (bold, #FF8F00) | "2026.05.17 14:03" (#AAAAAA, 12px)
    - Small thumbnail photo on right (60x60px, border-radius 8px)
  - Card 2 (Approved):
    - "도서관 2층 열람실" + "승인됨" badge
    - "❄️ 에어컨 켜짐 감지"
    - "+30P" | "2026.05.17 11:20"
  - Card 3 (Pending):
    - "인문관 B동 205호" + "검토 중" badge (blue)
    - "🔆 조명 켜짐 감지"
    - "+? P" (#AAAAAA) | "2026.05.16 16:45"
  - Card 4 (Rejected):
    - "공학관 A동 105호" + "반려" badge (red)
    - "판별 불가 — 사진 불명확" (#C62828, 14px)
    - "0P" (#AAAAAA) | "2026.05.16 09:12"
- Bottom navigation bar (제보이력 tab selected)

Mood: Clean list view, easy to scan status, history at a glance.
```

---

## Screen 05 — 관리자 대시보드 (웹, 데스크탑)

```
Design an admin dashboard web screen (desktop, 1200px max width) for EcoReport admin portal.

Screen content:
- Top navigation bar: "EcoReport 관리자" logo left, building selector dropdown "공학관 A동 ▼" center-right, admin avatar right
- Sidebar left (240px wide):
  - Menu items: 대시보드(selected), 제보 관리, 건물·강의실, 시간표, 정산 내역, 설정
  - Selected item: bg #FFF9C4, left border 3px #FFC107, text #1A1A1A bold
- Main content area:
  - Stats row (3 cards equal width):
    - Card 1: "이번 달 제보" label, "47건" large number (#1A1A1A, 32px bold), trend "+12% 전월比" in green
    - Card 2: "추정 절약 전기료" label, "320,000원" (32px bold, #388E3C), "243 kWh" sub
    - Card 3: "처리 대기" label, "3건" (32px bold, #FF8F00), "즉시 확인 필요" sub text
  - Section title: "최근 제보 목록"
  - Data table:
    - Columns: 접수 시간 | 강의실 | AI 판별 결과 | 상태 | 조치
    - Row 1: "14:03" | "공학관 A동 303호" | "🔆 조명 켜짐" | "대기" badge (yellow) | [처리하기] button
    - Row 2: "13:41" | "공학관 A동 201호" | "❄️ 에어컨 켜짐" | "완료" badge (green) | —
    - Row 3: "11:20" | "공학관 A동 105호" | "판별불가" | "반려" badge (red) | [재검토] ghost button
    - Alternating row background: white / #FAFAFA
  - Monthly savings trend: simple area chart below table
    - X axis: 1월~5월
    - Area fill: #E8F5E9, line: #4CAF50
    - Chart title: "월별 절약량 추이 (kWh)"

Style: Professional admin panel feel, data-dense but clean. Use card shadows consistently. Primary accent on action buttons.
```

---

## Screen 06 — 온보딩 / 로그인

```
Design the onboarding/login screen for EcoReport mobile app (first screen new users see).

Screen content:
- Full-screen gradient background: top #FFFDE7 to bottom #E8F5E9 (yellow-green soft gradient)
- Top area (40% height): large hero illustration or icon
  - Central icon: leaf 🌿 + lightning bolt ⚡ combined, 100px, colored #4CAF50 and #FFC107
  - Or: simplified illustration of a campus building with lights on, cartoonish style
- Middle text block (centered):
  - App name: "에코리포트" (32px bold, #1A1A1A)
  - Tagline: "캠퍼스 에너지 낭비를 발견하면\n사진 한 장으로 제보하고 포인트 받기!" (16px, #555555, centered, 2 lines)
- Value props (3 rows with icons):
  - "📷 사진 한 장으로 간편 제보"
  - "⚡ AI 즉시 판별 + 포인트 적립"
  - "🌿 캠퍼스 탄소 절감에 기여"
  - Each: icon left, text right, 14px, #555555
- Bottom CTA area:
  - Google login button: white bg, Google logo left, "Google로 시작하기" text, border #E0E0E0, height 52px, border-radius 8px
  - Divider: "또는"
  - Email login text link: "이메일로 로그인" (#555555, 14px, underline)
  - Below: "계정이 없으신가요? 회원가입" smallest text (#AAAAAA)

Mood: Welcoming, green and energetic, trust-inspiring, very approachable.
```

---

## 사용 팁

- 각 프롬프트 상단에 **공통 스타일 컨텍스트**를 함께 붙여넣으면 일관성이 높아짐
- Stitch에서 "Refine" 기능으로 세부 조정 (예: "make the CTA button larger", "add bottom navigation")
- 생성 후 피그마로 내보내기 → shadcn 컴포넌트로 구현 시 참고
