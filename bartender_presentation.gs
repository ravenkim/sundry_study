/**
 * 바텐더 (Bartender) — 공모전 발표용 Google Slides 생성 스크립트
 * GDG Daejeon 2025  |  총 12슬라이드
 *
 * 실행: Google Apps Script 에디터에서 createBartenderPresentation() 실행
 */
function createBartenderPresentation() {
  var PRES_ID = '1lw0G-cnAZnFybTmGI94KgmkiKPVsyTuj9aCTrKnoVPE';
  var pres = SlidesApp.openById(PRES_ID);

  // ── 기존 슬라이드 초기화 ────────────────────────────────────────
  var existing = pres.getSlides();
  for (var i = existing.length - 1; i > 0; i--) existing[i].remove();
  existing[0].getPageElements().forEach(function(el) { try { el.remove(); } catch(e) {} });

  // ── 색상 팔레트 (앤틱 바 · 앰버 다크 테마) ─────────────────────
  var C = {
    bg:        '#1C0F06',
    bgCard:    '#2C1A0A',
    bgCard2:   '#3A2310',
    bgHdr:     '#0D0703',
    gold:      '#C8A96E',
    goldL:     '#E5C98C',
    cream:     '#F5E6D3',
    amber:     '#B8946E',
    hi:        '#FF9E2C',
    blue:      '#4285F4',
    green:     '#66BB6A',
    teal:      '#26A69A'
  };
  var W = 720, H = 405;

  // ══════════════════════════════════════════════════════════════════
  // 헬퍼 함수
  // ══════════════════════════════════════════════════════════════════

  function setBg(sl, color)  { sl.getBackground().setSolidFill(color); }

  function clr(sl) {
    sl.getPageElements().forEach(function(el) { try { el.remove(); } catch(e) {} });
  }

  function rect(sl, x, y, w, h, fill, stroke, sw) {
    var sh = sl.insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, w, h);
    sh.getFill().setSolidFill(fill || C.bgCard);
    if (stroke) { sh.getBorder().getLineFill().setSolidFill(stroke); sh.getBorder().setWeight(sw||1.5); }
    else sh.getBorder().setTransparent();
    return sh;
  }

  function ell(sl, x, y, w, h, fill) {
    var sh = sl.insertShape(SlidesApp.ShapeType.ELLIPSE, x, y, w, h);
    sh.getFill().setSolidFill(fill); sh.getBorder().setTransparent(); return sh;
  }

  function rr(sl, x, y, w, h, fill, stroke, sw) {
    var sh = sl.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, w, h);
    sh.getFill().setSolidFill(fill || C.bgCard);
    if (stroke) { sh.getBorder().getLineFill().setSolidFill(stroke); sh.getBorder().setWeight(sw||1.5); }
    else sh.getBorder().setTransparent();
    return sh;
  }

  function txt(sl, str, x, y, w, h, o) {
    o = o || {};
    var tb = sl.insertTextBox(str, x, y, w, h);
    tb.getBorder().setTransparent(); tb.getFill().setTransparent();
    var tf = tb.getText(), st = tf.getTextStyle();
    st.setFontFamily(o.font || 'Malgun Gothic');
    st.setFontSize(o.sz || 13);
    st.setForegroundColor(o.c || C.cream);
    st.setBold(!!o.bold);
    if (o.it) st.setItalic(true);
    var pa = tf.getParagraphStyle();
    if (o.al === 'c') pa.setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    else if (o.al === 'r') pa.setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
    return tb;
  }

  function footer(sl, n) {
    rect(sl, 0, H-22, W, 22, C.bgHdr);
    txt(sl, 'GDG Daejeon 2025  ·  바텐더 (Bartender)', 16, H-18, 540, 16, {sz:9, c:C.amber});
    txt(sl, n+' / 12', W-52, H-18, 44, 16, {sz:9, c:C.amber, al:'r'});
  }

  function hdr(sl, title, sub) {
    rect(sl, 0, 0, W, 52, C.bgHdr);
    rect(sl, 0, 52, W, 3, C.gold);
    txt(sl, title, 18, 7, 620, 30, {sz:21, c:C.gold, bold:true});
    if (sub) txt(sl, sub, 18, 33, 620, 18, {sz:10, c:C.amber});
  }

  function newSlide() { return pres.appendSlide(SlidesApp.PredefinedLayout.BLANK); }

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 1: 표지
  // ══════════════════════════════════════════════════════════════════
  var s1 = pres.getSlides()[0];
  clr(s1); setBg(s1, C.bg);

  ell(s1, W-260, -90, 340, 340, '#241509');
  ell(s1, W-160, H-130, 250, 250, '#1E1008');
  ell(s1, -70, H-160, 270, 270, '#1E1008');

  rect(s1, 0, 0, W, 4, C.gold);
  rect(s1, 55, 52, 5, 255, C.gold);

  txt(s1, '바텐더', 75, 44, 460, 108, {sz:82, c:C.gold, bold:true});
  txt(s1, 'Bartender', 77, 148, 430, 42, {sz:27, c:C.goldL});
  rect(s1, 77, 198, 470, 2, C.gold);
  txt(s1, '1인 가구를 위한 AI 바텐더 동반자 앱', 77, 208, 530, 32, {sz:17, c:C.cream});
  txt(s1, '#1인가구  #외로움해소  #식생활가이드  #건강한음주문화', 77, 244, 550, 22, {sz:11, c:C.amber});

  rr(s1, 77, 274, 248, 36, C.bgCard, C.gold, 1.5);
  txt(s1, '🏆  GDG Daejeon  |  2025', 87, 281, 228, 22, {sz:12, c:C.goldL, bold:true});

  txt(s1, '⚙  Built with  Antigravity  ·  Gemini CLI  ·  Google AI Studio  ·  Stitch',
    77, 322, 570, 20, {sz:10, c:C.amber, it:true});

  rect(s1, 0, H-22, W, 22, C.bgHdr);
  txt(s1, 'GDG Daejeon 2025  ·  바텐더 (Bartender)', 16, H-18, 540, 16, {sz:9, c:C.amber});

  s1.getNotesPage().getSpeakerNotesShape().getText().setText(
    "안녕하세요, '바텐더' 프로젝트 발표를 시작합니다.\n" +
    "1인 가구의 외로움과 식생활 문제를 AI로 해결하는 앱입니다.\n" +
    "Antigravity, Gemini CLI, Google AI Studio Stitch를 적극 활용해 개발했습니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 2: 개발 팀 & 환경
  // ══════════════════════════════════════════════════════════════════
  var s2 = newSlide(); setBg(s2, C.bg);
  hdr(s2, '⚙  개발 팀 & 환경', 'AI 도구로 AI 앱을 만드는 메타적 개발 방식');

  rr(s2, 18, 64, 336, 148, C.bgCard, C.hi, 1.5);
  txt(s2, '⚡  Antigravity', 30, 72, 310, 30, {sz:18, c:C.hi, bold:true});
  rect(s2, 30, 104, 308, 1.5, C.hi);
  txt(s2, 'AI 코드 생성 · 자동 완성 · 리팩터링\n\n복잡한 FastAPI 라우터, Pydantic 스키마,\nSQLAlchemy 모델을 AI가 자동 생성.\n개발 속도를 대폭 단축.',
    30, 110, 308, 94, {sz:11, c:C.cream});

  rr(s2, 366, 64, 336, 148, C.bgCard, C.blue, 1.5);
  txt(s2, '✦  Gemini CLI', 378, 72, 310, 30, {sz:18, c:C.blue, bold:true});
  rect(s2, 378, 104, 308, 1.5, C.blue);
  txt(s2, '터미널에서 Gemini와 직접 대화\n\n바텐더 시스템 프롬프트 튜닝,\n응답 품질 검증, 페르소나 최적화를\n커맨드라인에서 신속하게 수행.',
    378, 110, 308, 94, {sz:11, c:C.cream});

  rr(s2, 18, 224, 336, 110, C.bgCard, C.teal, 1.5);
  txt(s2, '🔬  Google AI Studio + Stitch', 30, 232, 310, 26, {sz:14, c:C.teal, bold:true});
  rect(s2, 30, 260, 308, 1.5, C.teal);
  txt(s2, '프롬프트 설계·테스트 → Stitch "Get Code"\n→ google-genai SDK 코드 자동 생성',
    30, 268, 308, 58, {sz:11, c:C.cream});

  rr(s2, 366, 224, 336, 110, C.bgCard, C.gold, 1.5);
  txt(s2, '🤖  Google Gemini API', 378, 232, 310, 26, {sz:14, c:C.gold, bold:true});
  rect(s2, 378, 260, 308, 1.5, C.gold);
  txt(s2, 'gemini-2.0-flash 모델\ngoogle-genai SDK (최신 버전)',
    378, 268, 308, 58, {sz:11, c:C.cream});

  txt(s2, '"AI 도구로 AI를 만든다 — 개발 전 과정에서 AI를 페어 프로그래머로 활용"',
    18, 344, W-36, 26, {sz:12, c:C.goldL, it:true, al:'c'});

  footer(s2, 2);
  s2.getNotesPage().getSpeakerNotesShape().getText().setText(
    "AI 도구로 AI 앱을 만드는 메타적 접근을 취했습니다.\n" +
    "Antigravity: 백엔드 코드 자동 생성\n" +
    "Gemini CLI: 프롬프트 튜닝·검증\n" +
    "AI Studio + Stitch: SDK 통합 코드 자동 생성"
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 3: 문제 정의
  // ══════════════════════════════════════════════════════════════════
  var s3 = newSlide(); setBg(s3, C.bg);
  hdr(s3, '🔍  문제 정의', '늘어나는 1인 가구, 혼자 보내는 일상의 이면');

  rect(s3, 18, 64, W-36, 36, C.bgCard2);
  txt(s3, '대한민국 1인 가구  34.5% (2023) — 3가구 중 1가구가 혼자 산다',
    28, 71, W-56, 22, {sz:12, c:C.goldL, bold:true, al:'c'});

  var probs = [
    {n:'01', title:'관계·대화 결핍', color:C.hi,
     body:'퇴근 후 하루를 나눌\n상대의 부재\n\n정서적 공백·\n외로움 누적'},
    {n:'02', title:'식생활 결정 피로', color:C.gold,
     body:'매일 혼자 먹고\n마실 때 겪는\n메뉴·술 선택의\n어려움과 재료\n처리 부담'},
    {n:'03', title:'경험의 단절', color:C.teal,
     body:'단순 챗봇이나\n배달 앱만으로는\n\'나만의 밤 맥락\'을\n연결하는\n정서적 교류 부족'}
  ];
  probs.forEach(function(p, i) {
    var px = 18 + i*236;
    rr(s3, px, 110, 222, 220, C.bgCard, p.color, 1.5);
    txt(s3, p.n, px+12, 116, 60, 40, {sz:30, c:p.color, bold:true});
    txt(s3, p.title, px+12, 155, 200, 28, {sz:14, c:C.cream, bold:true});
    rect(s3, px+12, 185, 192, 1.5, p.color);
    txt(s3, p.body, px+12, 193, 200, 130, {sz:11, c:C.amber});
  });

  txt(s3, '→  세 문제를 하나의 앱으로 해결할 "단골 바" 경험이 필요하다',
    18, 340, W-36, 26, {sz:13, c:C.gold, bold:true, al:'c'});

  footer(s3, 3);
  s3.getNotesPage().getSpeakerNotesShape().getText().setText(
    "1인 가구가 일상에서 겪는 세 가지 핵심 문제입니다.\n" +
    "1) 관계·대화 결핍  2) 식생활 결정 피로  3) 경험의 단절\n" +
    "이 세 가지를 하나의 앱으로 해결합니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 4: 솔루션
  // ══════════════════════════════════════════════════════════════════
  var s4 = newSlide(); setBg(s4, C.bg);
  hdr(s4, "💡  솔루션", "내 방 안의 단골 바 — AI 바텐더 '준'");

  ell(s4, 280, 62, 160, 160, C.bgCard);
  txt(s4, '🍸', 316, 102, 88, 80, {sz:50, al:'c'});
  txt(s4, '준  (Jun)', 248, 228, 224, 28, {sz:17, c:C.gold, bold:true, al:'c'});
  txt(s4, 'AI 바텐더', 268, 254, 184, 22, {sz:12, c:C.amber, al:'c'});

  var sols = [
    {title:'▶  먼저 다가가는 대화', c:C.hi,   x:18,  body:'앱 접속 시 기분·하루를\n먼저 묻고 공감하며 대화'},
    {title:'▶  맥락 있는 추천',     c:C.gold,  x:18,  body:'대화 속 자연스러운\n술 · 안주 · 음악 세트 제안'},
    {title:'▶  냉장고 레시피',      c:C.teal,  x:452, body:'남은 재료로\n1인분 안주 즉시 생성'},
    {title:'▶  Responsible AI',    c:C.green, x:452, body:'과음 유도 없이\n건강한 음주 문화 동반'}
  ];
  sols.forEach(function(s, i) {
    var sy = (i % 2 === 0) ? 68 : 168;
    rr(s4, s.x, sy, 252, 88, C.bgCard, s.c, 1.5);
    txt(s4, s.title, s.x+10, sy+8, 232, 26, {sz:13, c:s.c, bold:true});
    rect(s4, s.x+10, sy+36, 224, 1.5, s.c);
    txt(s4, s.body, s.x+10, sy+44, 232, 38, {sz:11, c:C.cream});
  });

  rect(s4, 18, 280, W-36, 58, C.bgCard2);
  txt(s4, '"단골손님, 오늘은 어떤 하루였나요? 한 주 고생하셨죠 —\n오늘은 위스키 한 잔 어때요?"',
    28, 288, W-56, 38, {sz:12, c:C.goldL, it:true, al:'c'});
  txt(s4, '→  바텐더 준의 첫 마디 — 항상 먼저 말을 건다',
    28, 326, W-56, 18, {sz:10, c:C.amber, al:'c'});

  footer(s4, 4);
  s4.getNotesPage().getSpeakerNotesShape().getText().setText(
    "솔루션의 핵심은 AI 바텐더 '준'입니다.\n" +
    "준은 항상 먼저 말을 건네고 대화 속에서 음료·안주·음악을 추천합니다.\n" +
    "'단골손님'이라고 부르며 단골 바 분위기를 만듭니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 5: 핵심 기능 5가지
  // ══════════════════════════════════════════════════════════════════
  var s5 = newSlide(); setBg(s5, C.bg);
  hdr(s5, '📱  핵심 기능 5가지', '각 기능이 관계·식생활·건강음주 문제 중 하나 이상을 해결');

  var feats = [
    {ic:'🏠', title:'F-01  홈 / 인사',       c:C.hi,   body:'접속 시 바텐더가\n시간·날씨 기반으로\n먼저 인사'},
    {ic:'💬', title:'F-02  AI 대화',         c:C.gold, body:'자유 채팅 + 자연스러운\n술·안주·음악 추천\n과음 징후 감지'},
    {ic:'🍾', title:'F-03  추천',            c:C.blue, body:'기분·취향 기반\n술 + 안주 + 음악\n세트 추천'},
    {ic:'🥚', title:'F-04  냉장고',          c:C.teal, body:'재료 입력 →\n1인분 레시피\n배달 꿀조합 제안'},
    {ic:'📓', title:'F-05  테이스팅 노트',   c:C.green,body:'음주 기록 + 별점\n5개 누적 시\n취향 분석 피드백'}
  ];

  feats.forEach(function(f, i) {
    var fx = 18 + i*138;
    rr(s5, fx, 64, 130, 268, C.bgCard, f.c, 1.5);
    txt(s5, f.ic, fx+5, 70, 120, 44, {sz:30, al:'c'});
    txt(s5, f.title, fx+6, 116, 118, 34, {sz:11, c:f.c, bold:true});
    rect(s5, fx+8, 152, 106, 1.5, f.c);
    txt(s5, f.body, fx+6, 158, 118, 100, {sz:10.5, c:C.cream});
  });

  rect(s5, 18, 344, W-36, 28, C.bgCard2);
  txt(s5, 'F-06  단골 시스템  —  매일 방문 스트릭 · 단골→VIP→명예단골 등급 · 주간 리포트',
    28, 350, W-56, 18, {sz:11, c:C.amber, al:'c'});

  footer(s5, 5);
  s5.getNotesPage().getSpeakerNotesShape().getText().setText(
    "5가지 핵심 기능입니다.\n" +
    "홈 인사 → AI 대화 → 추천 → 냉장고 → 테이스팅 노트\n" +
    "추가로 단골 시스템이 매일 방문을 유도합니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 6: AI 개발 파이프라인 (Stitch → AI Studio)
  // ══════════════════════════════════════════════════════════════════
  var s6 = newSlide(); setBg(s6, C.bg);
  hdr(s6, '🔬  AI 개발 파이프라인', 'Google AI Studio Stitch → google-genai SDK 자동 통합');

  var pipe = [
    {title:'Prompt\nDesign',  sub:'AI Studio에서\n바텐더 프롬프트\n설계·테스트', c:C.teal},
    {title:'Stitch\n변환',    sub:'"Get Code"\n버튼 클릭 →\nSDK 코드 생성', c:C.blue},
    {title:'SDK\n통합',       sub:'google-genai\nFastAPI\n백엔드 연결',    c:C.gold},
    {title:'CLI\n검증',       sub:'Gemini CLI로\n응답 품질\n검증·튜닝',    c:C.hi}
  ];

  pipe.forEach(function(p, i) {
    var px = 18 + i*176;
    rr(s6, px, 64, 164, 148, C.bgCard, p.c, 1.5);
    txt(s6, p.title, px+8, 74, 148, 46, {sz:19, c:p.c, bold:true, al:'c'});
    rect(s6, px+12, 124, 132, 1.5, p.c);
    txt(s6, p.sub, px+8, 130, 148, 72, {sz:10.5, c:C.cream, al:'c'});
    if (i < pipe.length-1) txt(s6, '→', px+168, 126, 20, 24, {sz:16, c:C.amber, bold:true});
  });

  rect(s6, 18, 224, W-36, 104, '#0D0703', C.teal, 1);
  txt(s6, '// Stitch 로 생성된 코드 — be/app/ai/gemini_client.py',
    28, 231, W-56, 18, {sz:10, c:C.teal, bold:true, font:'Consolas'});
  txt(s6,
    'from google import genai\nfrom google.genai import types\n\n' +
    'client = genai.Client(api_key=settings.GEMINI_API_KEY)\n' +
    'response = client.models.generate_content(\n' +
    '    model="gemini-2.0-flash", contents=contents,\n' +
    '    config=types.GenerateContentConfig(system_instruction=persona)\n' +
    ')',
    28, 251, W-56, 72, {sz:9.5, c:C.cream, font:'Consolas'});

  txt(s6,
    '✦  AI Studio 프롬프트 최적화  →  Stitch "Get Code"  →  FastAPI 통합  →  Gemini CLI 검증',
    18, 336, W-36, 22, {sz:11, c:C.goldL, al:'c'});

  footer(s6, 6);
  s6.getNotesPage().getSpeakerNotesShape().getText().setText(
    "AI 통합 파이프라인입니다.\n" +
    "1) Google AI Studio에서 바텐더 페르소나 프롬프트 설계\n" +
    "2) Stitch 'Get Code'로 Python SDK 코드 자동 생성\n" +
    "3) 생성된 코드를 FastAPI 백엔드에 통합\n" +
    "4) Gemini CLI로 응답 품질 최종 검증\n" +
    "이 흐름 덕분에 AI 통합 작업을 크게 단축할 수 있었습니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 7: 기술 스택
  // ══════════════════════════════════════════════════════════════════
  var s7 = newSlide(); setBg(s7, C.bg);
  hdr(s7, '🛠  기술 스택 (Tech Stack)', '최신 풀스택 + Google AI 생태계 완전 통합');

  rr(s7, 18, 64, 214, 272, C.bgCard, C.hi, 1.5);
  txt(s7, '⚛  Frontend', 28, 71, 196, 26, {sz:14, c:C.hi, bold:true});
  rect(s7, 28, 99, 188, 1.5, C.hi);
  txt(s7, 'React 19  +  Vite\nTypeScript\nTailwind CSS 4\nShadcn UI  (Radix UI)\nRedux Toolkit\nReact Router 7\nYarn 4 (PnP)',
    28, 106, 196, 218, {sz:11.5, c:C.cream});

  rr(s7, 244, 64, 214, 272, C.bgCard, C.gold, 1.5);
  txt(s7, '🐍  Backend', 254, 71, 196, 26, {sz:14, c:C.gold, bold:true});
  rect(s7, 254, 99, 188, 1.5, C.gold);
  txt(s7, 'FastAPI  (Python 3.12)\nSQLAlchemy 2.x\nPostgreSQL\nPydantic v2\nJWT  +  bcrypt\nAlembic\nUvicorn',
    254, 106, 196, 218, {sz:11.5, c:C.cream});

  rr(s7, 470, 64, 232, 272, C.bgCard, C.blue, 1.5);
  txt(s7, '🤖  AI & DevTools', 480, 71, 214, 26, {sz:14, c:C.blue, bold:true});
  rect(s7, 480, 99, 206, 1.5, C.blue);
  txt(s7, 'Google Gemini API\n  gemini-2.0-flash\n  google-genai SDK\n\nGoogle AI Studio\nStitch (코드 자동생성)\n\nGemini CLI\nAntigravity',
    480, 106, 214, 218, {sz:11.5, c:C.cream});

  footer(s7, 7);
  s7.getNotesPage().getSpeakerNotesShape().getText().setText(
    "기술 스택은 세 영역으로 구성됩니다.\n" +
    "Frontend: React 19 + TypeScript + Tailwind CSS 4\n" +
    "Backend: FastAPI + PostgreSQL\n" +
    "AI & DevTools: Google Gemini API, AI Studio, Stitch, Gemini CLI, Antigravity"
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 8: 화면 구성 1 (홈 & 대화)
  // ══════════════════════════════════════════════════════════════════
  var s8 = newSlide(); setBg(s8, C.bg);
  hdr(s8, '📱  화면 구성 1', '홈 (바 카운터)  &  AI 대화 (Chat)');

  rr(s8, 18, 64, 316, 272, C.bgCard, C.gold, 1.5);
  txt(s8, '🏠  홈 — 바 카운터', 28, 71, 296, 26, {sz:14, c:C.gold, bold:true});
  rect(s8, 28, 99, 292, 1.5, C.gold);
  txt(s8,
    '접속 시 바텐더 \'준\'이 먼저 인사\n\n' +
    '▸  시간대·날씨 기반 맞춤 인사말\n' +
    '▸  오늘의 추천 카드 (술/안주/음악)\n' +
    '▸  빠른 접근 버튼\n   — 대화 / 추천 / 냉장고\n' +
    '▸  방문 스트릭 뱃지 표시\n\n' +
    '앤틱 바 · 마호가니 톤\n앰버·골드 UI 테마 적용',
    28, 106, 296, 222, {sz:11, c:C.cream});

  rr(s8, 346, 64, 356, 272, C.bgCard, C.hi, 1.5);
  txt(s8, '💬  AI 대화 — 바텐더와 채팅', 356, 71, 336, 26, {sz:14, c:C.hi, bold:true});
  rect(s8, 356, 99, 332, 1.5, C.hi);
  txt(s8,
    '바텐더가 먼저 말을 건네는 채팅\n\n' +
    '▸  "어서오세요, 단골손님!"\n   기분·원하는 음료를 가볍게 질문\n' +
    '▸  대화 흐름 속 음료·안주 자연 추천\n' +
    '▸  인라인 추천 카드 UI\n   (음악 YouTube 링크 포함)\n' +
    '▸  과음 징후 감지 → 물·휴식 권유\n' +
    '▸  부적합 상황 → 무알코올 대안 제안',
    356, 106, 336, 222, {sz:11, c:C.cream});

  footer(s8, 8);
  s8.getNotesPage().getSpeakerNotesShape().getText().setText(
    "홈 화면은 앤틱 바 컨셉으로 바텐더가 먼저 인사를 건넵니다.\n" +
    "채팅 화면은 자연스러운 대화 속에서 음료와 안주를 추천하는 핵심 기능입니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 9: 화면 구성 2 (냉장고 & 테이스팅 노트)
  // ══════════════════════════════════════════════════════════════════
  var s9 = newSlide(); setBg(s9, C.bg);
  hdr(s9, '📱  화면 구성 2', '냉장고 안주  &  테이스팅 노트');

  rr(s9, 18, 64, 326, 272, C.bgCard, C.teal, 1.5);
  txt(s9, '🥚  냉장고 — 재료 → 레시피', 28, 71, 306, 26, {sz:14, c:C.teal, bold:true});
  rect(s9, 28, 99, 302, 1.5, C.teal);
  txt(s9,
    '냉장고 재료를 태그로 입력\n\n' +
    '▸  입력 예: 달걀, 두부, 파, 참치캔\n' +
    '▸  Gemini API가 1인분 레시피 즉시 생성\n   — 재료·조리 시간·단계별 방법\n' +
    '▸  재료 없을 때 배달 꿀조합 제안\n   (최소주문금액 고려)\n' +
    '▸  간단한 영양 포인트 함께 제공',
    28, 106, 306, 222, {sz:11, c:C.cream});

  rr(s9, 356, 64, 346, 272, C.bgCard, C.green, 1.5);
  txt(s9, '📓  테이스팅 노트', 366, 71, 326, 26, {sz:14, c:C.green, bold:true});
  rect(s9, 366, 99, 322, 1.5, C.green);
  txt(s9,
    '마신 술을 기록하고 취향을 쌓는 노트\n\n' +
    '▸  술 이름 / 주종 / 별점 1~5 (필수)\n' +
    '▸  향(Nose) · 맛(Palate) · 피니시(Finish)\n' +
    '▸  위스키 전용: 증류소·숙성연수·캐스크\n' +
    '▸  바텐더 코멘트 자동 생성\n\n' +
    '★  기록 5개 이상 → 취향 분석 피드백\n' +
    '"단골손님은 피트향 강한 아일라 계열을\n' +
    ' 선호하시네요. 아드벡도 도전해 보세요."',
    366, 106, 326, 222, {sz:11, c:C.cream});

  footer(s9, 9);
  s9.getNotesPage().getSpeakerNotesShape().getText().setText(
    "냉장고 기능은 남은 재료로 1인분 레시피를 즉시 생성합니다.\n" +
    "테이스팅 노트는 음주 기록을 쌓고 바텐더가 취향을 분석해주는 개인화 기능입니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 10: Responsible AI
  // ══════════════════════════════════════════════════════════════════
  var s10 = newSlide(); setBg(s10, C.bg);
  hdr(s10, '🛡  Responsible AI', '건강한 음주문화 — 경쟁 앱과의 핵심 차별점');

  var rais = [
    {ic:'🤝', t:'자기결정 존중',  c:C.gold,  b:'잔 수·도수를 경쟁으로\n유도하지 않음. "오늘은\n가볍게" 선택을 존중'},
    {ic:'💧', t:'몸과 맥락',      c:C.teal,  b:'대화 중 물·안주·\n천천히 마시기를\n자연스럽게 제안'},
    {ic:'🌙', t:'안전한 마무리',  c:C.hi,    b:'과음 징후 감지 시\n부드럽게 종료·\n휴식·물 권유'},
    {ic:'🚫', t:'부적합 상황',    c:C.green, b:'미성년·운전·약 복용\n감지 시 무알코올·\n차·안주로 전환'},
    {ic:'📖', t:'기록의 의미',    c:C.blue,  b:'경쟁이 아닌 향·\n취향 학습·추억을\n위한 테이스팅 노트'},
    {ic:'🔍', t:'투명성',         c:C.amber, b:'주류 정보는 정보 제공\n개인 한도를\n대신 판단하지 않음'}
  ];

  rais.forEach(function(r, i) {
    var col = i % 3, row = Math.floor(i/3);
    var rx = 18 + col*234, ry = 64 + row*130;
    rr(s10, rx, ry, 222, 120, C.bgCard, r.c, 1.5);
    txt(s10, r.ic+'  '+r.t, rx+10, ry+8, 202, 28, {sz:13, c:r.c, bold:true});
    rect(s10, rx+10, ry+38, 194, 1.5, r.c);
    txt(s10, r.b, rx+10, ry+46, 202, 68, {sz:10.5, c:C.cream});
  });

  footer(s10, 10);
  s10.getNotesPage().getSpeakerNotesShape().getText().setText(
    "Responsible AI는 경쟁 앱과의 핵심 차별점입니다.\n" +
    "단순히 음주를 권장하는 앱이 아닌, 건강하고 안전한 음주 문화를 만드는 앱입니다.\n" +
    "6가지 원칙을 코드·프롬프트·UX 전반에 적용했습니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 11: 기대 효과 & 비전
  // ══════════════════════════════════════════════════════════════════
  var s11 = newSlide(); setBg(s11, C.bg);
  hdr(s11, '🚀  기대 효과 & 비전', '분절된 경험을 하나의 단골 바로 통합');

  var effs = [
    {n:'01', t:'분절된 경험의 통합', c:C.gold,
     b:'단순 챗봇 · 배달앱 · 기록앱을 "단골 바" 하나로 묶어 완벽한 몰입감 제공'},
    {n:'02', t:'정서적 지지망 형성', c:C.hi,
     b:'1인 가구의 일상 속 정서적 공백을 완화하고 소소한 루틴과 연결감 형성'},
    {n:'03', t:'Responsible AI 실천', c:C.green,
     b:'단순 소비를 부추기지 않고 건강하고 안전한 휴식을 제안하는 따뜻한 AI 서비스'}
  ];

  effs.forEach(function(e, i) {
    var ey = 64 + i*88;
    rr(s11, 18, ey, W-36, 80, C.bgCard, e.c, 1.5);
    txt(s11, e.n, 28, ey+6, 36, 38, {sz:24, c:e.c, bold:true});
    txt(s11, e.t, 72, ey+6, 320, 26, {sz:16, c:e.c, bold:true});
    rect(s11, 72, ey+34, W-108, 1.5, e.c);
    txt(s11, e.b, 72, ey+42, W-108, 30, {sz:11.5, c:C.cream});
  });

  txt(s11, '→  모든 혼술이, 단골 바에서 마시는 것처럼 따뜻하고 풍요로울 수 있도록',
    18, 334, W-36, 28, {sz:13, c:C.goldL, it:true, bold:true, al:'c'});

  footer(s11, 11);
  s11.getNotesPage().getSpeakerNotesShape().getText().setText(
    "세 가지 기대 효과입니다.\n" +
    "1) 분절된 경험의 통합\n" +
    "2) 정서적 지지망 형성\n" +
    "3) Responsible AI 실천\n" +
    "모든 혼술이 단골 바에서 마시는 것처럼 따뜻하길 바랍니다."
  );

  // ══════════════════════════════════════════════════════════════════
  // SLIDE 12: Q&A / 감사합니다
  // ══════════════════════════════════════════════════════════════════
  var s12 = newSlide(); setBg(s12, C.bg);
  clr(s12);
  setBg(s12, C.bg);

  ell(s12, W-220, -80, 300, 300, '#241509');
  ell(s12, -80, H-150, 260, 260, '#1E1008');

  rect(s12, 0, 0, W, 4, C.gold);

  txt(s12, '감사합니다', 0, 60, W, 90, {sz:58, c:C.gold, bold:true, al:'c'});
  txt(s12, 'Thank You', 0, 148, W, 42, {sz:25, c:C.goldL, al:'c'});
  rect(s12, 220, 198, 280, 2, C.gold);

  txt(s12, '🍸  바텐더 (Bartender)', 0, 208, W, 34, {sz:20, c:C.cream, bold:true, al:'c'});
  txt(s12, '1인 가구를 위한 AI 바텐더 동반자 앱', 0, 244, W, 24, {sz:13, c:C.amber, al:'c'});

  rr(s12, 270, 276, 180, 48, C.bgCard, C.hi, 2);
  txt(s12, 'Q & A', 270, 284, 180, 30, {sz:22, c:C.hi, bold:true, al:'c'});

  txt(s12, 'React  ·  FastAPI  ·  PostgreSQL  ·  Gemini API  ·  Antigravity  ·  Gemini CLI  ·  AI Studio  ·  Stitch',
    0, 334, W, 20, {sz:9, c:C.amber, al:'c'});

  rect(s12, 0, H-22, W, 22, C.bgHdr);
  txt(s12, 'GDG Daejeon 2025  ·  바텐더 (Bartender)', 16, H-18, 540, 16, {sz:9, c:C.amber});
  txt(s12, '12 / 12', W-52, H-18, 44, 16, {sz:9, c:C.amber, al:'r'});

  s12.getNotesPage().getSpeakerNotesShape().getText().setText(
    "이상으로 발표를 마칩니다.\n" +
    "Antigravity와 Gemini CLI로 AI 도구를 적극 활용해 개발한 경험이 의미 있었습니다.\n" +
    "질문 부탁드립니다."
  );

  Logger.log('✅ 바텐더 프레젠테이션 생성 완료 — 총 12슬라이드');
}
