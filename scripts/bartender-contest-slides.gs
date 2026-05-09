/**
 * 바텐더(Bartender) — 공모전용 Google 슬라이드 생성 스크립트 (개선판)
 *
 * 개선 요약
 * - 한 번의 실행으로 동일 프레젠테이션을 "처음부터" 다시 구성 (슬라이드 중복 없음)
 * - 설정(CONFIG)·슬라이드 목록(SLIDE_DECK) 분리 → 문장만 고치면 재생성 가능
 * - ppt_master 흐름에 맞춘 선택적 챕터(구획) 슬라이드
 * - 제목·본문 폰트·크기·색을 헬퍼로 통일
 *
 * 사용법
 * 1) CONFIG.PRESENTATION_ID 에 전체 URL 또는 ID 문자열을 넣습니다.
 * 2) 반드시 그 파일에 대해 **편집자** 권한이 있어야 합니다. 「보기 전용」이면 openById 실패 후
 *    예전 버전은 **다른 브라우저 탭의 슬라이드**에 써서, 이 링크 문서는 안 바뀐 것처럼 보였습니다.
 *    → 지금은 기본으로 그렇게 넘어가지 않습니다(FALLBACK 비활성).
 * 3) script.google.com 이면 첫 실행 시 Google 계정 승인.
 * 4) rebuildBartenderContestPresentation() 실행 후, 실행 기록(보기) 로그에 **대상 파일 이름·ID** 확인.
 *
 * 참고: /job/ai/ai_platform/third_party/ppt_master (표지 → 목차 → 근거 → 솔루션 → 실증 → 기술 → 마무리)
 */

var CONFIG = {
  /** 전체 URL 또는 ID. 보기 전용 링크면 편집 권한으로 파일 열기/복사본 사용. */
  PRESENTATION_ID:
    'https://docs.google.com/presentation/d/1lw0G-cnAZnFybTmGI94KgmkiKPVsyTuj9aCTrKnoVPE/edit',
  /**
   * true: openById 실패 시 「지금 포커스된」슬라이드에 씀 — 다른 파일에 들어갈 수 있으니 기본 false
   */
  FALLBACK_TO_ACTIVE_WHEN_OPEN_BY_ID_FAILS: false,
  /** true: 챕터 구분 슬라이드(다크 톤) 삽입 — 발표 장이 길어지므로 발표 시간에 맞게 끄기도 가능 */
  USE_SECTION_DIVIDERS: true,
  /** Google Slides에서 선택 가능 — Noto Sans KR(본문·제목), 없으면 Slides 기본 폰트로 대체 */
  FONT_TITLE: 'Noto Sans KR',
  FONT_BODY: 'Noto Sans KR',
  SIZES: {
    COVER_TITLE: 40,
    END_TITLE: 44,
    PAGE_TITLE: 32,
    PAGE_TITLE_LONG: 30,
    TWO_COL_TITLE: 28,
    BODY: 14,
    PLACEHOLDER: 12
  }
};

/** 색상은 #rrggbb 문자열 (setSolidFill / setForegroundColor 호환). SlidesApp.newRgbColor 미지원 환경 대비 */
var THEME = {
  DARK_BG: '#002E5D',
  CONTENT_BG: '#F5F5F7',
  TITLE: '#002E5D',
  BODY: '#333333',
  MUTED: '#666666',
  ON_DARK: '#FFFFFF',
  ON_DARK_MUTED: '#DCE6F0'
};

/**
 * CONFIG.PRESENTATION_ID: 순수 ID 또는 브라우저 주소창의 전체 URL 모두 허용
 */
function extractPresentationId(raw) {
  if (raw == null) return '';
  var s = String(raw).trim();
  if (!s) return '';
  var m = s.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = s.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  s = s.split('?')[0].split('#')[0];
  if (/^[a-zA-Z0-9_-]+$/.test(s) && s.length >= 12) return s;
  return '';
}

/**
 * 수정할 Presentation을 가져옵니다.
 * ID가 지정된 경우 openById만 신뢰하고, 실패 시 기본은 활성 탭으로 넘어가지 않습니다.
 */
function getTargetPresentation() {
  var rawId = CONFIG && CONFIG.PRESENTATION_ID != null ? CONFIG.PRESENTATION_ID : '';
  var id = extractPresentationId(rawId);
  var allowActiveFallback =
    CONFIG && CONFIG.FALLBACK_TO_ACTIVE_WHEN_OPEN_BY_ID_FAILS === true;

  if (id.length > 0) {
    try {
      var presById = SlidesApp.openById(id);
      if (presById) {
        Logger.log(
          '[바텐더 슬라이드] 대상 확정(openById): "' +
            presById.getName() +
            '" / id=' +
            presById.getId()
        );
        return presById;
      }
      Logger.log('[바텐더 슬라이드] openById가 빈 값을 반환했습니다. id=' + id);
    } catch (eOpen) {
      Logger.log('[바텐더 슬라이드] openById 예외: ' + eOpen);
    }

    if (!allowActiveFallback) {
      throw new Error(
        '이 URL/ID의 프레젠테이션을 열 수 없거나, 스크립트 계정에 편집 권한이 없습니다.\n\n' +
          '· 브라우저에서 해당 슬라이드를 연 뒤 우측 상단이 「보기 전용」이 아닌지 확인하세요.\n' +
          '· 파일 소유자에게 **편집자** 권한을 요청하거나, 내 드라이브에 복사 후 복사본 URL/ID를 CONFIG에 넣으세요.\n' +
          '· Apps Script 실행 계정(에디터 우측 상단)이 편집 권한 있는 계정과 같은지 확인하세요.\n' +
          '· 정말로 지금 열어 둔 다른 슬라이드에 쓰려면 CONFIG.FALLBACK_TO_ACTIVE_WHEN_OPEN_BY_ID_FAILS 를 true로 바꾸세요.'
      );
    }
  }

  try {
    var active = SlidesApp.getActivePresentation();
    if (active) {
      Logger.log(
        '[바텐더 슬라이드] 대상 확정(활성 탭): "' +
          active.getName() +
          '" / id=' +
          active.getId()
      );
      return active;
    }
  } catch (eAct) {
    Logger.log('getActivePresentation 실패: ' + eAct);
  }

  throw new Error(
    '프레젠테이션을 열 수 없습니다. PRESENTATION_ID를 올바르게 넣거나, 편집할 슬라이드 탭을 연 뒤 실행하세요.'
  );
}

/** 실행이 끝나면 어떤 파일에 썼는지 알림(컨테이너·UI 가능할 때만 팝업). */
function notifyRebuildDone_(presentation, slideCount) {
  var msg =
    '슬라이드 생성 완료: ' +
    slideCount +
    '장\n\n대상: ' +
    presentation.getName() +
    '\nID: ' +
    presentation.getId();
  Logger.log('[바텐더 슬라이드] ' + msg.replace(/\n\n/g, ' | ').replace(/\n/g, ' '));
  try {
    SlidesApp.getUi().alert(msg);
  } catch (ignore) {
    /* 독립형 스크립트·트리거 등 UI 없음 */
  }
}

/**
 * 기존 슬라이드를 비우고, 맨 앞에 표준 TITLE 레이아웃 1장만 남깁니다.
 * presentation 을 생략하면 getTargetPresentation() 으로 자동 조회합니다.
 */
function resetPresentationToSingleTitleSlide(presentation) {
  if (presentation == null) {
    presentation = getTargetPresentation();
  }
  try {
    presentation.insertSlide(0, SlidesApp.PredefinedLayout.TITLE);
    while (presentation.getSlides().length > 1) {
      presentation.getSlides()[presentation.getSlides().length - 1].remove();
    }
  } catch (e) {
    throw new Error(
      '슬라이드 초기화(insertSlide/remove) 실패. 편집할 Google 슬라이드가 맞는지, Slides 서비스 권한이 있는지 확인하세요. 상세: ' +
        (e && e.message ? e.message : e)
    );
  }
}

function setContentBackground(slide) {
  slide.getBackground().setSolidFill(THEME.CONTENT_BG);
}

function setDarkBackground(slide) {
  slide.getBackground().setSolidFill(THEME.DARK_BG);
}

function trySetFontFamily(textStyle, family) {
  if (!family) return;
  try {
    textStyle.setFontFamily(family);
  } catch (e) {
    /* 글꼴 미설치 시 무시 */
  }
}

function stylePageTitle(textRange, pt) {
  var ts = textRange.getTextStyle();
  ts.setForegroundColor(THEME.TITLE).setBold(true);
  if (pt) ts.setFontSize(pt);
  trySetFontFamily(ts, CONFIG.FONT_TITLE);
}

function styleBodyText(textRange, pt) {
  var size = pt || CONFIG.SIZES.BODY;
  var ts = textRange.getTextStyle();
  ts.setForegroundColor(THEME.BODY).setFontSize(size);
  trySetFontFamily(ts, CONFIG.FONT_BODY);
}

function stylePlaceholderColumn(textRange) {
  var ts = textRange.getTextStyle();
  ts.setForegroundColor(THEME.MUTED).setFontSize(CONFIG.SIZES.PLACEHOLDER);
  trySetFontFamily(ts, 'Courier New');
}

/** 표지·챕터·엔딩: 다크 배경 + 밝은 글자 (TITLE 레이아웃의 텍스트 플레이스홀더만) */
function styleHeroSlide(slide, titlePt, subtitlePt) {
  setDarkBackground(slide);
  var shapes = slide.getShapes();
  var ti = titlePt || CONFIG.SIZES.COVER_TITLE;
  var si = subtitlePt || CONFIG.SIZES.BODY;
  for (var i = 0; i < shapes.length; i++) {
    var shape = shapes[i];
    try {
      var tr = shape.getText();
      if (!tr || !tr.asString()) continue;
      var ts = tr.getTextStyle();
      ts.setForegroundColor(i === 0 ? THEME.ON_DARK : THEME.ON_DARK_MUTED).setBold(i === 0);
      ts.setFontSize(i === 0 ? ti : si);
      trySetFontFamily(ts, i === 0 ? CONFIG.FONT_TITLE : CONFIG.FONT_BODY);
    } catch (err) {
      /* 텍스트 없는 도형 */
    }
  }
}

function setSpeakerNotes(slide, text) {
  if (!text) return;
  slide.getNotesPage().getSpeakerNotesShape().getText().setText(text);
}

/**
 * 표지: TITLE 레이아웃 — 첫 번째 플레이스홀더=제목, 둘째=부제
 */
function slideCover(presentation, spec) {
  var slide = presentation.getSlides()[0];
  var shapes = slide.getShapes();
  shapes[0].getText().setText(spec.title);
  shapes[1].getText().setText(spec.subtitle);
  styleHeroSlide(slide, CONFIG.SIZES.COVER_TITLE, CONFIG.SIZES.BODY);
  setSpeakerNotes(slide, spec.notes);
}

function appendTitleBody(presentation, spec) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
  setContentBackground(slide);
  slide.getShapes()[0].getText().setText(spec.title);
  stylePageTitle(slide.getShapes()[0].getText(), spec.titleSize || CONFIG.SIZES.PAGE_TITLE);
  slide.getShapes()[1].getText().setText(spec.body);
  styleBodyText(slide.getShapes()[1].getText());
  setSpeakerNotes(slide, spec.notes);
}

function appendTwoColumn(presentation, spec) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
  setContentBackground(slide);
  slide.getShapes()[0].getText().setText(spec.title);
  stylePageTitle(slide.getShapes()[0].getText(), spec.titleSize || CONFIG.SIZES.TWO_COL_TITLE);
  slide.getShapes()[1].getText().setText(spec.left);
  styleBodyText(slide.getShapes()[1].getText());
  slide.getShapes()[2].getText().setText(spec.right);
  stylePlaceholderColumn(slide.getShapes()[2].getText());
  setSpeakerNotes(slide, spec.notes);
}

/** 챕터: 제목만 큰 TITLE 슬라이드 */
function appendSection(presentation, spec) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE);
  slide.getShapes()[0].getText().setText(spec.title);
  slide.getShapes()[1].getText().setText(spec.subtitle || '');
  styleHeroSlide(slide, 34, 16);
  setSpeakerNotes(slide, spec.notes);
}

function appendClosing(presentation, spec) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE);
  slide.getShapes()[0].getText().setText(spec.title);
  slide.getShapes()[1].getText().setText(spec.subtitle);
  styleHeroSlide(slide, CONFIG.SIZES.END_TITLE, CONFIG.SIZES.BODY);
  setSpeakerNotes(slide, spec.notes);
}

/**
 * 슬라이드 데이터만 수정하면 전체 덱이 갱신됩니다.
 * kind: cover | section | titleBody | twoCol | closing
 */
function buildSlideDeckSpecs() {
  var deck = [
    {
      kind: 'cover',
      title: '바텐더 (Bartender)',
      subtitle:
        '1인 가구를 위한 AI 바텐더 동반자 앱\n' +
        '「단골 바」경험으로 외로움·식생활 결정 피로를 완화\n\n' +
        '#1인가구 #외로움 #식생활 #건강한음주문화 #ResponsibleAI',
      notes:
        '인사 후, 해커톤·공모전 주제(1인가구·외로움·식생활)와 바로 연결해 주세요. 팀명·이름은 말로 보완합니다.'
    },
    {
      kind: 'titleBody',
      title: '발표 목차',
      body:
        '1. 프로젝트 개요\n' +
        '2. 문제 정의 · 타깃\n' +
        '3. 솔루션 · 핵심 기능\n' +
        '4. 화면·사용자 경험\n' +
        '5. 기술 스택 · 아키텍처\n' +
        '6. 디자인·AI 워크플로 (Stitch → AI Studio)\n' +
        '7. 개발 프로세스 (Antigravity · Gemini CLI)\n' +
        '8. 차별점 · 기대 효과 · 비전',
      notes: '심사 위원이 전체 흐름을 잡을 수 있게 30초 안에 읽어 줍니다.'
    }
  ];

  if (CONFIG.USE_SECTION_DIVIDERS) {
    deck.push({
      kind: 'section',
      title: '01  배경과 문제',
      subtitle: '왜 지금, 누구의 어떤 아픔인가',
      notes: '챕터 전환 한 문장.'
    });
  }

  deck.push(
    {
      kind: 'titleBody',
      title: '프로젝트 개요',
      body:
        '▶ 한 줄 정의\n' +
        '   퇴근 후 집에서 만나는 「내 방 안의 단골 바」—AI 바텐더 「준」이 먼저 말을 걸고, 대화·추천·기록을 한 흐름으로 이어 줍니다.\n\n' +
        '▶ 왜 바(Bar)인가\n' +
        '   친숙한 공간 메타포로 대화(정서)와 음식·음료(실용)를 자연스럽게 묶고, 챗봇·레시피 앱을 오가며 끊기던 맥락을 복원합니다.\n\n' +
        '▶ 범위\n' +
        '   동반자·추천·기록(비의료·비주류판매). 건강한 음주문화·안전한 응대를 제품 원칙으로 둡니다.',
      notes: 'doc/problem-definition.md 의「가설·범위」와 맞춰 설명하면 심사 Q&A에 강합니다.'
    },
    {
      kind: 'titleBody',
      title: '배경 및 문제 정의',
      body:
        '▶ 배경\n' +
        '   1인 가구 증가, 퇴근 후·주말 혼자 시간이 일상화 — 관계·대화 결핍과 식·음료 결정 피로가 겹치는 영역이 반복됩니다.\n\n' +
        '▶ Pain Point 3요약\n' +
        '   1. 관계·대화 결핍 — 하루를 말로 정리할 상대 부재, 정서적 공백\n' +
        '   2. 식생활·의사결정 피로 — 메뉴·술·안주, 남은 재료, 최소주문 등 결정 누적\n' +
        '   3. 경험의 단절 — 챗봇·배달·기록이 분리되어 「오늘 밤」맥락이 이어지지 않음',
      notes: '필요 시 1인가구 통계 한 줄을 말로 보강하세요.'
    },
    {
      kind: 'titleBody',
      title: '타깃 사용자 · 기존 대안의 한계',
      body:
        '▶ 타깃\n' +
        '   혼자 사는 성인(직장인·대학생). 집에서 혼술·혼밥이 잦고, 대화와 「오늘 뭐 하지」결정 부담을 동시에 느끼는 사람.\n\n' +
        '▶ 기존 대안\n' +
        '   · 일반 챗봇 → 술·1인 식생활 맥락·페르소나·루틴 약함\n' +
        '   · 레시피·배달 앱 → 정서적 교류 없음\n' +
        '   · SNS·스트리밍 → 오늘 나에게 맞는 추천·대화와 거리 있음\n\n' +
        '→ 「단골 바」세계관 안에서 두 축을 한 번에 풀 제품 니치.',
      notes: '비목표(실제 주류 판매, 의료 대체 등)는 질문 나오면 짧게 선을 긋습니다.'
    }
  );

  if (CONFIG.USE_SECTION_DIVIDERS) {
    deck.push({
      kind: 'section',
      title: '02  솔루션과 경험',
      subtitle: '기능·화면·사용자 여정',
      notes: ''
    });
  }

  deck.push(
    {
      kind: 'titleBody',
      title: '솔루션: AI 바텐더 「준」',
      body:
        '▶ 먼저 다가가는 대화\n' +
        '   접속 시 기분·하루를 묻고 공감(존댓말, 과한 유행어 지양).\n\n' +
        '▶ 맥락 있는 추천\n' +
        '   대화 속에서 술·안주·음악을 세트로 제안(1인 분량·집에서 가능한 수준).\n\n' +
        '▶ 냉장고·테이스팅 노트·루틴\n' +
        '   남은 재료 → 레시피/꿀조합, 마신 술 기록 → 취향 요약 피드백.\n\n' +
        '▶ 책임감 있는 AI (Responsible)\n' +
        '   과음 징후 시 물·휴식 권유. 운전·미성년·약 복용 등에는 주류 미권장.',
      notes: '페르소나 상세는 doc/persona.md 와 동일 톤으로 말하면 됩니다.'
    },
    {
      kind: 'titleBody',
      title: '핵심 사용자 여정 (데모 시나리오)',
      body:
        '퇴근 후 앱 실행 → 바텐더 인사·기분 체크 → 대화 중 추천 카드(음료·안주·음악)\n' +
        '→ (선택) 냉장고 재료 입력·레시피 · 테이스팅 노트 저장 → 「오늘 밤」맥락이 한 앱에 남음\n\n' +
        '[ 발표 팁 ] 실제 데모는 1분 버전: 로그인 생략 또는 사전 로그인 후 채팅·추천 1회만 보여도 충분합니다.',
      notes: '「시나리오가 한 줄로 설명되는가」 검증에 대응하는 슬라이드입니다.'
    },
    {
      kind: 'twoCol',
      title: '화면 1: 로그인 & 메인 바(홈)',
      left:
        '【 로그인 】\n' +
        '앤틱 바 입구 느낌. 짙은 마호가니 + 골드 포인트.\n\n' +
        '【 홈 】\n' +
        '시간·날씨 맞춤 인사(말풍선), 빠른 접근: 대화 / 요리·위스키 추천',
      right: '[ 이미지 ]\n로그인·홈 스크린샷',
      notes: '시각은 Stitch·실구현 캡처를 나란히 넣으면 설득력이 큽니다.'
    },
    {
      kind: 'twoCol',
      title: '화면 2: AI 바텐더 대화 (Chat)',
      left:
        '【 흐름 】\n' +
        '· 준이 공감하며 대화 주도\n' +
        '· 분위기 질문 → 음료·안주·음악으로 자연 연결\n' +
        '· 인라인 추천 카드(예: 음악 링크)\n' +
        '· 과음 징후 시 부드러운 마무리·수분·휴식',
      right: '[ 이미지 ]\n채팅 화면',
      notes: 'Gemini 기반 응답 품질을 짧게 언급할 포인트입니다.'
    },
    {
      kind: 'twoCol',
      title: '화면 3: 냉장고 & 테이스팅 노트',
      left:
        '【 냉장고 】\n' +
        '남은 재료 태그 → 1인 레시피·배달 꿀조합\n\n' +
        '【 테이스팅 노트 】\n' +
        '별점·향·맛 기록 → 누적 시 취향 요약 피드백',
      right: '[ 이미지 ]\n냉장고·노트 화면',
      notes: '식생활 키워드와 직접 연결되는 화면입니다.'
    }
  );

  if (CONFIG.USE_SECTION_DIVIDERS) {
    deck.push({
      kind: 'section',
      title: '03  기술과 제작 과정',
      subtitle: '스택 · Stitch/AI Studio · Antigravity · Gemini CLI',
      notes: ''
    });
  }

  deck.push(
    {
      kind: 'titleBody',
      title: '기술 스택 · 아키텍처 개요',
      body:
        '▶ Frontend\n' +
        '   React 19, Vite, TypeScript, Tailwind CSS 4, Redux Toolkit, React Router 7\n' +
        '   Shadcn UI 기반 커스텀 — 앤틱/세피아 다크 톤\n\n' +
        '▶ Backend · Data · AI\n' +
        '   FastAPI(Python), PostgreSQL, SQLAlchemy\n' +
        '   Google Gemini API(google-genai) — 대화·추천 엔진\n\n' +
        '▶ 구조(한 줄)\n' +
        '   SPA ↔ REST/API ↔ Gemini · DB — 확장 가능한 모놀리식/서비스 분리 여지',
      notes: '배포 도면이 있으면 이 슬라이드에 다이어그램 이미지를 덧붙이면 좋습니다.'
    },
    {
      kind: 'titleBody',
      title: '디자인·프로토타입 파이프라인: Stitch → AI Studio',
      titleSize: CONFIG.SIZES.PAGE_TITLE_LONG,
      body:
        '▶ Stitch\n' +
        '   UI 목업·와이어를 빠르게 잡고, 화면 간 흐름·카피 톤을 시각적으로 고정했습니다.\n\n' +
        '▶ Google AI Studio로의 전환\n' +
        '   화면 구조·프롬프트 초안을 바탕으로, AI Studio에서 Gemini 동작·시스템 지시문·Few-shot 응답을 반복 실험하여\n' +
        '   「준」페르소나와 추천 문구를 구현에 맞는 형태로 맞췄습니다.\n\n' +
        '▶ 효과\n' +
        '   디자인 의도와 LLM 응답이 같은 「단골 바」세계관을 유지하도록, 프로토타입 단계에서 정합성을 앞당겼습니다.',
      notes: 'Stitch 내보내기 형식·AI Studio 프로젝트명을 구체화하면 신뢰도가 올라갑니다.'
    },
    {
      kind: 'titleBody',
      title: '개발 프로세스: Antigravity · Gemini CLI',
      titleSize: CONFIG.SIZES.PAGE_TITLE_LONG,
      body:
        '▶ Antigravity (에이전틱 개발 환경)\n' +
        '   기능을 작업 단위로 쪼개 에이전트가 탐색·수정·검증하도록 두어,\n' +
        '   라우팅·상태·API 연동 같은 반복 수정을 빠르게 돌렸습니다.\n\n' +
        '▶ Gemini CLI\n' +
        '   터미널에서 코드 생성·리팩터·디버그 설명·커밋 메시지 초안까지 이어 붙여,\n' +
        '   백엔드 스키마·프롬프트 상수·타입 정의를 한 흐름으로 맞췄습니다.\n\n' +
        '▶ 강조 메시지\n' +
        '   「도구에 맡길 것과 사람이 결정할 것(제품 톤·안전·윤리)」을 분리해 속도와 품질을 동시에 노렸습니다.',
      notes: '구체 커맨드 예 1개만 보여 주어도 기억에 남습니다.'
    },
    {
      kind: 'titleBody',
      title: '차별점 · 경쟁력',
      body:
        '▶ 단일 세계관\n' +
        '   대화·추천·재료·기록·루틴을 「바」한 곳에서 이어 사용 경험의 단절을 줄임.\n\n' +
        '▶ 페르소나 일관성\n' +
        '   문서화된 준(말투·경계·과음 대응)을 프롬프트·UI 카피에 동시 반영.\n\n' +
        '▶ AI 제품화\n' +
        '   Stitch → AI Studio로 대화 품질을 조기 검증, Antigravity·Gemini CLI로 구현 속도 확보.\n\n' +
        '▶ 윤리·안전\n' +
        '   Responsible AI 원칙을 기능·카피 수준에서 명시.',
      notes: '「챗GPT 앱과 뭐가 다른가」에 대한 답변 슬라이드로 쓰세요.'
    },
    {
      kind: 'titleBody',
      title: '기대 효과 · 비전 · 로드맵 메모',
      body:
        '1. 분절된 경험의 통합 — 몰입감 있는 「단골 바」루틴\n' +
        '2. 정서적 지지·소소한 야간 루틴 형성\n' +
        '3. Responsible AI — 소비 부추김이 아닌 휴식·안전 동반\n\n' +
        '▶ 로드맵(발표용 한 줄 예시)\n' +
        '   실사용자 테스트 → 추천 정확도·노트 인사이트 고도화 → (비목표인 결제 연동은 제외 명시)',
      notes: '시간이 남으면 팀 역할·감사 한 줄을 이어 말해도 됩니다.'
    },
    {
      kind: 'closing',
      title: '감사합니다',
      subtitle: '바텐더 (Bartender)\n질문에 기꺼이 답하겠습니다.\n\n연락처 · 레포 · 데모 URL: [채워 넣기]',
      notes: '마지막에 팀 로고나 QR을 배치하면 좋습니다.'
    }
  );

  return deck;
}

function applySpec(presentation, spec) {
  switch (spec.kind) {
    case 'cover':
      slideCover(presentation, spec);
      break;
    case 'section':
      appendSection(presentation, spec);
      break;
    case 'titleBody':
      appendTitleBody(presentation, spec);
      break;
    case 'twoCol':
      appendTwoColumn(presentation, spec);
      break;
    case 'closing':
      appendClosing(presentation, spec);
      break;
    default:
      throw new Error('Unknown slide kind: ' + spec.kind);
  }
}

/**
 * 메인 진입점: 프레젠테이션을 초기화한 뒤 SLIDE_DECK 순서대로 생성합니다.
 */
function rebuildBartenderContestPresentation() {
  var presentation = getTargetPresentation();
  resetPresentationToSingleTitleSlide(presentation);

  var specs = buildSlideDeckSpecs();
  for (var i = 0; i < specs.length; i++) {
    applySpec(presentation, specs[i]);
  }

  var n = presentation.getSlides().length;
  Logger.log('rebuildBartenderContestPresentation 완료: 총 ' + n + '장.');
  notifyRebuildDone_(presentation, n);
}

/** @deprecated 같은 이름으로 호출하는 기존 버튼이 있을 수 있어 위임만 유지 */
function createBartenderContestPresentation() {
  rebuildBartenderContestPresentation();
}
