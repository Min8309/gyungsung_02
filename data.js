/* =========================================================
   경성야록 — 내용 데이터 (data.js)
   글자·사진·배치·원문·현대어·2026년 기사·핀·속보 카드·라디오·부록 링크를
   바꾸고 싶으면 이 파일만 고치면 됩니다. (원문 전사는 txt 파일로도 넣을 수 있음 — 아래 transcriptFiles 참고)

   · site       : 제호와 머리글
   · faces      : 메인의 네 면 (사회 · 사기 · 문화예술 · 인물) — 부록은 appendix
   · articles   : 사건 하나하나
   · people     : 인물면 사진 자리
   · appendix   : 부록 카드
   · opening    : 오프닝 연도와 떠다니는 지면 조각
   · layout     : '목록으로'를 누르면 나오는 면별 옛 신문 지면
   · crops / illust / portraits : 사진 자료와 캡션
   · about / radioPage : '소개', '라디오 경성' 창

   사건 status
     'ready'    : 상세 페이지 전체 구성 (풀버전)
     'followup' : 목록에만 '속보 예정'
   still: true → 모든 연출 없이 조용히 (윤심덕·김우진 관련)
   date: '1933.05.17' 처럼 쓰면 화면에는 '1933. 5. 17'로 나옴
   grade: 신빙성 등급 (리서치 자료집 기준 A · B · C)
   ========================================================= */
window.YAROK = {

  site: {
    title: '京城夜錄',
    en: 'KYUNGSUNG ARCHIVE',
    tagline: '1924~1937 신문 속에 잠든 기록을 다시 펼치다',
    taglineHanja: '一九二四~一九三七 新聞 속에 잠든 記錄을 다시 펼치다',
    edition: '자정판 호외'
  },

  /* ---------- 한자 대응표 (기본은 한글 읽기 → 마우스를 대면 한자로) ----------
     readings : 한자 한 글자 → 한글 읽기 (1:1). 화면의 한글은 이 표로 한자를 한 글자씩 읽어서 만듭니다.
     wordReadings : 단어 첫머리에서 소리가 바뀌는 경우(두음법칙 등) 단어째로 읽기를 정함 — 글자 수는 같아야 함
     ※ 연도·날짜(一九三三年 같은 숫자)는 한 글자씩 읽지 않고 아라비아 숫자(1933년)로 보여줍니다. */
  readings: {
    '社': '사', '會': '회', '面': '면', '事': '사', '件': '건', '故': '고', '搜': '수', '査': '사', '裁': '재', '判': '판', '問': '문', '題': '제', '都': '도', '市': '시',
    '生': '생', '活': '활', '詐': '사', '欺': '기', '勸': '권', '誘': '유', '類': '류', '似': '사', '宗': '종', '敎': '교', '不': '불', '動': '동', '産': '산', '迷': '미',
    '信': '신', '瞞': '만', '文': '문', '化': '화', '藝': '예', '術': '술', '言': '언', '論': '론', '檢': '검', '閱': '열', '學': '학', '家': '가', '大': '대', '衆': '중',
    '運': '운', '競': '경', '技': '기', '人': '인', '物': '물', '記': '기', '者': '자', '作': '작', '獨': '독', '立': '립', '附': '부', '錄': '록', '詩': '시', '小': '소',
    '說': '설', '映': '영', '畫': '화', '冊': '책', '現': '현', '在': '재', '竹': '죽', '添': '첨', '町': '정', '塵': '진', '芥': '개', '場': '장', '怪': '괴', '當': '당',
    '時': '시', '地': '지', '圖': '도', '日': '일', '章': '장', '旗': '기', '紙': '지', '主': '주', '廣': '광', '告': '고', '斷': '단', '頭': '두', '乳': '유', '兒': '아',
    '釜': '부', '山': '산', '草': '초', '梁': '량', '慘': '참', '殺': '살', '靑': '청', '陽': '양', '少': '소', '年': '년', '金': '김', '貞': '정', '弼': '필', '本': '본',
    '夫': '부', '毒': '독', '嫌': '혐', '疑': '의', '萬': '만', '寶': '보', '誤': '오', '報': '보', '白': '백', '黃': '황', '騷': '소', '朝': '조', '鮮': '선', '銀': '은',
    '行': '행', '平': '평', '壤': '양', '支': '지', '店': '점', '七': '칠', '十': '십', '八': '팔', '圓': '원', '盜': '도', '難': '난', '孫': '손', '基': '기', '禎': '정',
    '抹': '말', '消': '소', '尹': '윤', '心': '심', '悳': '덕', '祐': '우', '鎭': '진', '玄': '현', '海': '해', '灘': '탄', '部': '부', '長': '장', '健': '건', '李': '이',
    '吉': '길', '用': '용', '張': '장', '弘': '홍', '義': '의', '擧': '거', '玉': '옥', '觀': '관', '彬': '빈', '被': '피', '聲': '성', '樂': '악', '京': '경', '城': '성',
    '夜': '야', '號': '호', '外': '외', '索': '색', '目': '목', '準': '준', '備': '비', '中': '중', '代': '대', '語': '어', '表': '표', '全': '전', '體': '체', '度': '도',
    '別': '별', '紹': '소', '介': '개', '原': '원', '道': '도', '槪': '개', '要': '요', '關': '관', '聯': '련', '出': '출', '處': '처', '憑': '빙', '性': '성', '等': '등',
    '級': '급', '以': '이', '前': '전', '續': '속', '豫': '예', '定': '정', '新': '신', '聞': '문', '納': '납', '涼': '량', '特': '특', '輯': '집', '第': '제', '一': '일',
    '二': '이', '三': '삼', '四': '사', '六': '육', '九': '구', '漢': '한', '字': '자'
  },
  wordReadings: {
    '類似': '유사',      // 두음법칙 (류→유)
    '年度': '연도',      // 두음법칙 (년→연)
    '不動産': '부동산',  // 不는 ㄷ·ㅈ 앞에서 '부'
    '樂家': '악가'       // 聲樂家 = 성악가
  },

  /* ---------- 화면 글자 (한자 기본 → 마우스를 올리면 한글 현대어) ----------
     [한자·국한문, 한글] 순서. 팀원이 한자 표기를 검토할 수 있게 한곳에 모음.
     확실하지 않은 것은 // 검토필요 */
  labels: {
    edition:   ['京城夜錄 號外', '경성야록 호외'],
    archive:   ['KYUNGSUNG ARCHIVE', 'KYUNGSUNG ARCHIVE'],
    search:    ['檢索', '검색'],
    menu:      ['目錄', '메뉴'],                         // 검토필요: 메뉴를 目錄으로 옮김
    view:      ['보기 →', '보기 →'],
    censor:    ['檢閱', '검열'],
    prep:      ['準備中', '준비 중'],
    modernOn:  ['漢字로 보기', '한자로 보기'],
    modernOff: ['한글로 보기', '한글로 보기'],
    records:   ['全體 記錄 目錄', '전체 기록 목록'],
    years:     ['年度別', '연도별'],
    radio:     ['라디오 京城', '라디오 경성'],
    about:     ['紹介', '소개'],
    replay:    ['처음부터 다시', '처음부터 다시'],
    city:      ['京城', '경성'],
    face:      ['面', '면'],
    origMod:   ['原文 ↔ 現代語', '원문 ↔ 현대어'],
    tabModern: ['現代語 풀이', '현대어 풀이'],
    tabToday:  ['二〇二六年 報道 基準', '2026년 보도 기준'],
    overview:  ['事件 槪要', '사건 개요'],
    people:    ['關聯 人物', '관련 인물'],
    tags:      ['主要語', '키워드'],                     // 검토필요
    source:    ['原文 出處', '원문 출처'],
    grade:     ['信憑性 等級', '신빙성 등급'],
    radioSub:  ['記錄을 듣다', '기록을 듣다'],
    prev:      ['以前 事件', '이전 사건'],
    next:      ['다음 事件', '다음 사건'],
    prevFace:  ['以前 面의 記錄', '이전 면의 기록'],
    nextFace:  ['다음 面의 記錄', '다음 면의 기록'],
    toList:    ['目錄으로 돌아가기', '목록으로 돌아가기'],
    origTag:   ['原文 記事', '원문 기사'],
    extraCard: ['이 記事에는 알려지지 않은 뒷이야기가 있습니다', '이 기사에는 알려지지 않은 뒷이야기가 있습니다'],
    extraGo:   ['펼쳐 보기 →', '펼쳐 보기 →'],
    backToArt: ['‹ 記事로 돌아가기', '‹ 기사로 돌아가기'],
    backMain:  ['‹ 메인으로', '‹ 메인으로'],
    nextPage:  ['‹ 다음 面', '‹ 다음 면'],
    prevPage:  ['앞 面 ›', '앞 면 ›'],
    followup:  ['續報 豫定', '속보 예정'],
    full:      ['全文', '풀버전']
  },

  /* ---------- 원문 전사 txt 파일 규칙 ----------
     팀원이 assets/source 폴더에 아래 이름으로 txt(UTF-8)를 넣으면 상세 페이지에 바로 연결됩니다.
       {사건id}_original.txt  원문 전사 (옛 표기 그대로, 한자 포함)
       {사건id}_modern.txt    현대어 풀이 (오늘 맞춤법)  — original과 문단 수를 맞추면 문단별 한자→한글 전환
       {사건id}_2026.txt      2026년 보도 기준으로 다시 쓴 기사
     · 문단은 빈 줄 하나로 나눕니다.
     · 2026년 기사 안의 붉은 핀: [[2026년 표현|1933년 표현|바꾼 이유]]
     · 첫 줄이 '#'으로 시작하면 제목으로 씁니다.
     (http:// 주소로 열었을 때만 txt를 읽을 수 있습니다. 파일을 더블클릭해서 열면 '준비 중'으로 보입니다.) */
  transcriptFiles: { folder: 'assets/source/', original: '_original.txt', modern: '_modern.txt', today: '_2026.txt' },

  /* ---------- 라디오 음원 ----------
     assets/radio/{사건id}.mp3 파일이 있으면 재생, 없으면 '방송 준비 중' */
  radioFolder: 'assets/radio/',

  /* ---------- 메인의 면 (메뉴 순서대로) ----------
     hanja : 크게 쓰는 면 이름   ko : 한글 면 이름   keywords : 주제
     front : 메인에 작게 보이는 사건 제목   articles : 이 면의 사건 (목록 순서, 앞쪽 풀버전이 '첫 사건')
     fx    : 메인의 은은한 연출 — flip(활자·잉크) / num(광고 숫자·문 두드림) / smear(검열 먹칠) / none */
  faces: [
    { id: 'society', hanja: '社會', ko: '사회', keywords: [['事件·事故', '사건·사고'], ['搜査·裁判', '수사·재판'], ['社會問題', '사회문제'], ['都市·生活', '도시·생활']],
      photo: 'jukcheom_scene',
      front: ['jukcheomjeong', 'maria', 'cheongyang'],
      articles: ['jukcheomjeong', 'maria', 'cheongyang', 'kim-jeongpil', 'manbosan'], fx: 'flip' },
    { id: 'fraud', hanja: '詐欺', ko: '사기', keywords: [['詐欺·勸誘', '사기·권유'], ['類似宗敎', '유사종교'], ['不動産', '부동산'], ['迷信·欺瞞', '미신·속임수']],   // 검토필요: '속임수'를 欺瞞으로 옮김
      photo: 'dokkaebi', ad: 'a1',
      front: ['dokkaebi', 'baekbaekgyo'],
      articles: ['baekbaekgyo', 'dokkaebi', 'pyongyang-bank'], fx: 'num' },
    { id: 'culture', hanja: '文化藝術', ko: '문화·예술', keywords: [['言論·檢閱', '언론·검열'], ['文學·藝術家', '문학·예술가'], ['大衆文化', '대중문화'], ['運動競技', '스포츠']],   // 검토필요: '스포츠'를 運動競技로 옮김
      front: ['sohn-gijeong', 'hyeonhaetan'],
      articles: ['sohn-gijeong', 'hyeonhaetan'], fx: 'smear' },
    { id: 'people', hanja: '人物', ko: '인물', keywords: [['記者·作家', '기자·작가'], ['藝術家', '예술가'], ['獨立運動家', '독립운동가'], ['事件 속 人物', '사건 속 인물']],
      front: [],
      articles: ['p-hyeonjingeon', 'p-igilyong', 'p-jangjinhong', 'p-okgwanbin', 'p-yunsimdeok'], fx: 'none' }
  ],

  /* ---------- 메인 한 화면: 면마다 대표 이미지 · 편집 헤드라인 · 작은 카드 ----------
     ※ editorial(편집 헤드라인)과 카드 설명은 경성야록 팀이 쓰는 편집 문구입니다. 옛 기사 원문이 아닙니다.
        그래서 따옴표나 출처를 붙이지 않습니다. 한자 표기는 모두 // 검토필요
     hero  : 대표 이미지 — { a: 사건id, illust: 삽화 } 또는 { a: 사건id, crop: 스캔 조각 }
     panel : 대표 사진 오른쪽 어두운 판 (메인 대표 사진 패널) — kick: 머리표, year: 머리표 아래 연도, title: 큰 제목 두 줄, sub: 부제 두 줄
     cards : 작은 카드 1~2개 — { a: 사건id, desc: [한 줄, 카드 폭에 맞게 짧게] } / 사진 없이 글만이면 noPhoto: true
             title: [한자, 한글] 을 쓰면 사건 제목 대신 짧은 제목 / emptyThumb: '글씨' 면 사진 대신 빈 타원 틀
             사건이 모자라면 { illust: 당시 지도·사진 } 또는 { crop: 당시 지면 조각 } 으로 채움 */
  frontPage: {
    society: {
      hero: { a: 'jukcheomjeong', illust: 'social_19330517' },
      panel: { kick: '社會面', year: '一九三三', title: ['죽첨정', '괴사건'], sub: ['매립지의 새벽,', '신문은 엉뚱한 가족을 지목했다'] },
      cards: [
        { a: 'maria', title: ['마리아 慘殺事件', '마리아 참살사건'], emptyThumb: '寫眞 없음', desc: ['처벌받지 않았다.'] },
        { illust: 'jukcheom_map_ahyeon', title: ['當時 地圖', '당시 지도'], desc: ['죽첨정 현장 부근.'] }
      ]
    },
    culture: {
      hero: { a: 'sohn-gijeong', crop: 'sohn_hero' },
      panel: { kick: '文化面', year: '一九三六', title: ['지워진', '일장기'], sub: ['이 사진 한 장으로', '신문은 278일 멈췄다'] },
      cards: [
        { a: 'hyeonhaetan', noPhoto: true, desc: ['1926년 관부연락선. 목격자는 없었다.'] },
        { crop: 'culture_scrap1', title: ['當時 紙面', '당시 지면'], desc: ['1930년대 문화면.'] }
      ]
    },
    fraud: {
      hero: { a: 'baekbaekgyo', illust: 'fraud_19400314' },
      panel: { kick: '詐欺面', year: '一九三七', title: ['벼슬을', '판교주'], sub: ['헌금에 따라 대신 자리를 팔고,', '산속에 신도들을 묻었다'] },
      cards: [
        { a: 'dokkaebi', illust: 'dokkaebi', title: ['도깨비 집 騷動', '도깨비 집 소동'], desc: ['한밤 소동 뒤의 속셈.'] },
        { crop: 'a1', title: ['當時 廣告', '당시 광고'], desc: ['1930년대 신문 광고.'] }
      ]
    }
  },

  /* ---------- 사건 ----------
     공통   : face, hanja(처음 보이는 제목), ko(한글 제목), date, status, grade, desc(한 줄), people(검색용)
     풀버전 : headline(큰 제목 아래 한 줄), summary(3줄 요약), hero(대표 사진), originals(원문 지면 이미지),
              info(사건 간단 정보), extra(號外 속보 카드), radio(라디오 소개 글), transcript(원문 전사 — 없으면 null)
     ※ 리서치 자료집(경성야록_리서치자료집_지면별.pdf) 내용만 사용. 피해자·무고한 사람은 익명.
     ※ 옛 기사 문장은 지어내지 않음 → transcript: null 이면 '원문 전사 준비 중' */
  articles: {

    /* ===== 사회 ===== */
    'jukcheomjeong': {
      // 검토필요: 당시 동아일보 표기는 '乳兒斷頭事件', 조선일보는 '嬰兒斬頭事件'
      face: 'society', hanja: '竹添町 斷頭乳兒 事件', ko: '죽첨정 단두유아 사건', date: '1933.05.17', status: 'ready', grade: 'A',
      desc: '경성 전역에 비상이 걸린 1933년 5월의 사건',
      people: ['윤명구', '배구석'],
      headline: '죽첨정에서 발견된 의문의 사건',
      summary: [
        '1933년 5월 16일 오전, 죽첨정 3정목 식산은행 쓰레기 매립지에서 아이의 시신 일부가 발견됐다는 신고가 서대문경찰서에 들어왔습니다.',
        '동아일보는 5월 17일자에 첫 보도를 냈고, 6월 2일자에는 전혀 다른 가족을 유력 용의자로 보도했습니다.',
        '진범은 미신을 믿은 엿장수 윤명구와, 그의 부탁을 받고 이웃 아이의 무덤을 파헤친 배구석이었습니다.'
      ],
      hero: { illust: 'jukcheom_scene' },
      originals: [
        { src: 'assets/source/jukcheom_chosun_19330609.jpg', cap: '당시 지면 · 조선일보 1933. 6. 9 2면 · 분묘발굴죄·사체유기죄 적용 기사' },
        { src: 'assets/source/jukcheom_chosun_19330610.jpg', cap: '당시 지면 · 조선일보 1933. 6. 10 2면 · 관련자 송국 기사' },
        { src: 'assets/source/jukcheom_chosun_19330628.jpg', cap: '당시 지면 · 조선일보 1933. 6. 28 2면 · 기소 기사' }
      ],
      originalNote: '동아일보 1933. 5. 17자 원문 지면은 아직 확보하지 못해, 같은 사건을 다룬 조선일보 지면을 보여줍니다.',
      info: {
        overview: '1933년 5월 16일 오전 7시 30분, 죽첨정 3정목 식산은행 쓰레기 매립지에서 아이의 시신 일부가 발견됐다는 신고가 들어왔습니다. 뇌전증을 앓던 아들에게 아이의 뇌수가 특효약이라는 말을 믿은 엿장수 윤명구가 친구 배구석에게 부탁했고, 배구석은 2원을 받고 뇌막염으로 숨진 이웃 아이의 무덤을 파헤쳤습니다.',
        people: ['윤명구 (주범, 엿장수)', '배구석 (공범)', '숨진 아이와 유족 (익명)'],
        tags: ['1933', '경성', '죽첨정', '미신', '오보', '수사'],
        source: ['동아일보 1933. 5. 17 (첫 보도)', '동아일보 1933. 5. 18 (수사 경과)', '동아일보 1933. 6. 2 (오인 용의자 보도)'],
        caution: '아이의 성별이 출처마다 다릅니다. 원문 기사로 확인이 필요합니다.'
      },
      extra: {
        title: '처음 지목된 가족은 범인이 아니었다',
        body: [
          '동아일보는 1933년 6월 2일자에서, 죽첨정에서 대금업을 하다 숨진 사람의 가족 다섯 명이 서대문경찰서에 검거돼 조사를 받았다고 보도했습니다.',
          '이들은 범행을 모두 부인했고, 진범은 따로 있었습니다. 신문이 처음에 무고한 가족을 유력 용의자로 보도한 일은 \'오보와 언론의 책임\'을 묻는 핵심 사례입니다.',
          '2026년의 짝 사례: 2004년 \'쓰레기 만두\' 파동 — 경찰 발표를 언론이 대대적으로 보도했지만, 이후 재료가 유해하지 않다는 반박이 나왔습니다. (신빙성 B)'
        ],
        source: '리서치 자료집 · 사회면 「경성 죽첨정 단두유아 사건」'
      },
      radio: { title: '1933년 5월, 죽첨정의 밤', text: '1933년 5월, 동아일보에는 한 사건이 보도됩니다…' },
      transcript: null
    },

    'maria': {
      face: 'society', hanja: '釜山 草梁町 마리아 慘殺事件', ko: '부산 마리아 참살 사건', date: '1931.08.04', status: 'ready', grade: 'A',
      desc: '아무도 처벌받지 않은 미제 사건',
      people: [],
      headline: '아무도 처벌받지 않은 부산의 여름',
      summary: [
        '1931년 8월 1일 아침, 부산 초량정 철도국 관사에서 스무 살 조선인 하녀가 숨진 채 발견됐습니다. 일본인들이 이름을 어려워해 \'마리아\'라고 불리던 사람이었습니다.',
        '경찰은 한 달 뒤 주인집 부인을 체포했지만, 1심과 2심 모두 증거 불충분으로 무죄가 선고됐습니다.',
        '피의자·법원·경찰이 모두 일본인이었던 이 사건은 아무도 처벌받지 않은 채 사실상 미제로 남았습니다.'
      ],
      hero: { illust: 'maria' },
      originals: [
        { src: 'assets/portraits/maria_19331110.jpg', cap: '당시 지면 · 동아일보 1933. 11. 10 · 마리아가 숨진 방과 관련 보도' }
      ],
      originalNote: '동아일보 1931. 8. 4자 첫 보도 지면은 아직 확보하지 못했습니다.',
      info: {
        overview: '1931년 8월 1일 아침, 부산 초량정 철도국 관사에서 20세 조선인 하녀(별명 \'마리아\')가 숨진 채 발견됐습니다. 사건 직후 경찰서에 괴투서가 두 차례 날아들었고, 1933년 2월 체포된 철도국 공제조합 직원은 필적 감정 결과 괴투서를 쓴 사람으로 드러났습니다.',
        people: ['마리아 (피해자, 별명만 표기)', '주인집 부인 (1·2심 무죄)', '철도국 공제조합 직원 (괴투서 작성자로 드러남)'],
        tags: ['1931', '부산', '미제', '수사 실패', '식민지 재판'],
        source: ['동아일보 1931. 8. 4 (첫 보도)', '동아일보 1931. 9. 16 (관련 기사)'],
        caution: ''
      },
      extra: {
        title: '두 번 날아든 괴투서',
        body: [
          '사건 직후 경찰서에는 괴투서가 두 차례 날아들었습니다. 1933년 2월 용의자로 체포된 철도국 공제조합 직원은 필적 감정 결과 바로 그 괴투서를 쓴 사람으로 드러났습니다.',
          '그러나 피의자·법원·경찰이 모두 일본인이었고, 결국 아무도 처벌받지 않았습니다. 잡지 『중앙』 1934년 3월호도 이 사건을 다뤘습니다.',
          '2026년의 짝 사례: 윤성여 재심 무죄 — 범인으로 몰려 20년을 복역한 뒤, 2020년 재심에서 32년 만에 무죄가 선고됐습니다. (신빙성 A)'
        ],
        source: '리서치 자료집 · 사회면 「부산 마리아 참살 사건」'
      },
      radio: { title: '1931년 8월, 초량정 관사', text: '1931년 8월, 부산의 한 관사에서…' },
      transcript: null
    },

    'cheongyang':   { face: 'society', hanja: '靑陽 少年 殺人事件', ko: '청양 소년 살인사건', date: '1930', status: 'followup', grade: 'B-',
                      desc: '죽은 줄 알았던 소년이 돌아왔다', people: ['박창수'] },
    'kim-jeongpil': { face: 'society', hanja: '金貞弼 本夫毒殺 嫌疑事件', ko: '김정필 사건', date: '1924.07.17', status: 'followup', grade: 'A',
                      desc: '\'독살 미인\'이라는 제목이 남긴 것', people: ['김정필'],
                      extra: { title: '피고인을 \'미인\'이라 부른 제목',
                               body: ['동아일보 1924년 7월 17일자 제목은 「본부(本夫) 독살 미인(美人), 사형 불복」이었습니다. 피고인을 \'혐의자\'가 아니라 \'미인\'으로 부른 제목이 당시 보도 태도를 보여줍니다.',
                                      '1925년 10월 23일자에는 사진과 함께 관련 기사가 실렸습니다.'],
                               source: '리서치 자료집 · 사회면 「\'독살 미인\' 김정필 사건」' } },
    'manbosan':     { face: 'society', hanja: '萬寶山 事件 誤報', ko: '만보산 사건 오보', date: '1931', status: 'followup', grade: 'B',
                      desc: '과장 보도가 부른 참극과 정정보도', people: [] },

    /* ===== 사기 ===== */
    'baekbaekgyo': {
      face: 'fraud', hanja: '白白敎 事件', ko: '백백교 사건', date: '1937.06.08', status: 'ready', grade: 'A',
      desc: '신앙과 속임수가 만든 비극',
      people: ['전용해', '박태원'],
      headline: '벼슬을 약속한 교주, 그리고 남은 소문',
      summary: [
        '교주 전용해는 조선이 곧 자신의 통솔 아래 독립한다며, 헌금 액수에 따라 대신·도지사·경찰서장 자리를 주겠다고 신도들을 속였습니다.',
        '동아일보는 1937년 6월 8일자에 경찰 조서 3만 장 이상, 현장 조사 24차례에 이르는 수사 규모를, 6월 9일자에 피해자 314명을 보도했습니다.',
        '사건은 5년간의 조사와 재판 끝에 1942년 관련자 12명의 사형 선고로 마무리됐습니다.'
      ],
      hero: { illust: 'baekbaek' },
      originals: [
        { src: 'assets/scans/baekbaekgyo/13.jpg', cap: '당시 지면 · 동아일보 지면 스캔 (백백교 사건 관련)' },
        { src: 'assets/scans/baekbaekgyo/12.jpg', cap: '당시 지면 · 동아일보 지면 스캔 (백백교 사건 관련)' },
        { src: 'assets/scans/baekbaekgyo/10.jpg', cap: '당시 지면 · 동아일보 지면 스캔 (백백교 사건 관련)' }
      ],
      originalNote: '스캔마다 정확한 날짜는 원문 확인이 필요합니다.',
      info: {
        overview: '교주 전용해는 헌금 액수에 따라 벼슬을 주겠다고 속여 신도들의 재산을 빼앗았습니다. 교주는 1937년 4월 산속에서 숨진 채 발견됐지만, 그 뒤에도 신문에는 그가 위장해 도망쳤다는 소문이 여전하다는 보도가 실렸습니다.',
        people: ['전용해 (교주)', '박태원 (소설 「우맹」 작가)'],
        tags: ['1937', '유사종교', '집단 범죄', '속임수', '우맹'],
        source: ['동아일보 1937. 6. 8 (수사 규모)', '동아일보 1937. 6. 9 (피해자 314명)', '동아일보 1940. 3. 20 (논조 기사)'],
        caution: '피해자 수가 출처마다 크게 다릅니다(314명, 350여 명, 유골 380구, 620여 명). 이 페이지는 당시 동아일보 보도 기준 314명으로 적습니다.'
      },
      extra: {
        title: '숫자는 출처마다 달랐다',
        body: [
          '피해자 수는 자료마다 314명, 350여 명, 유골 380구, 620여 명으로 크게 다릅니다. 그래서 반드시 \'당시 동아일보 보도 기준 314명\'처럼 출처를 밝혀야 합니다.',
          '동아일보 1937년 6월 8일자는 각 읍면이 시체 처리 비용을 감당하지 못해 총독부에 지원을 요청했다고 전했습니다. 교주가 숨진 뒤에도 그가 위장해 도망쳤다는 소문이 신문에 실렸습니다.',
          '박태원의 소설 「우맹」(1938)이 이 사건을 소재로 했습니다.'
        ],
        source: '리서치 자료집 · 사회면 「백백교 사건」'
      },
      radio: { title: '1937년 6월, 산속의 교단', text: '1937년 6월, 신문은 수사 규모를 전합니다…' },
      transcript: null
    },
    'dokkaebi':       { face: 'fraud', hanja: '黃金町 도깨비 집 騷動',   // 검토필요: '도깨비 집'은 한글 그대로 둠
                        ko: '황금정 도깨비 집 소동', date: '1924.11.14', status: 'followup', grade: 'B',
                        desc: '100년 전에는 귀신을 팔았고, 지금은 집을 판다', people: [] },
    'pyongyang-bank': { face: 'fraud', hanja: '朝鮮銀行 平壤支店 七十八萬圓 大盜難',   // 검토필요: 발생 연도·보도일 미확인
                        ko: '조선은행 평양지점 78만원 도난', date: '1930년대', status: 'followup', grade: 'B',
                        desc: '금고에서 감쪽같이 사라진 현금', people: [] },

    /* ===== 문화·예술 ===== */
    'sohn-gijeong': {
      face: 'culture', hanja: '孫基禎 日章旗 抹消事件', ko: '손기정 일장기 말소사건', date: '1936.08.25', status: 'ready', grade: 'A',
      desc: '시상식 사진 속 일장기를 지운 신문',
      people: ['손기정', '이길용', '현진건', '이상범', '송진우'],
      headline: '지워진 일장기, 기록을 지킨 사람들',
      summary: [
        '1936년 8월 25일자 동아일보 석간 제2판 2면에 일장기를 완전히 지운 손기정 선수의 시상식 사진이 실렸습니다.',
        '화가 이상범, 기자 이길용, 현진건 사회부장 등 8명이 구속됐고, 송진우 사장 등 3명이 물러났습니다.',
        '동아일보는 1936년 8월 29일부터 이듬해 6월 2일까지 278일 동안 무기정간됐습니다.'
      ],
      hero: { crop: 'sohn_ceremony' },
      originals: [
        { src: 'assets/scans/sohn-gijeong/05.jpg', cap: '당시 지면 · 동아일보 지면 스캔 (손기정 선수 사진)' },
        { src: 'assets/scans/sohn-gijeong/04.jpg', cap: '당시 지면 · 동아일보 지면 스캔' },
        { src: 'assets/scans/sohn-gijeong/08.jpg', cap: '당시 지면 · 동아일보 지면 스캔' }
      ],
      originalNote: '스캔마다 정확한 날짜는 원문 확인이 필요합니다.',
      info: {
        overview: '1936년 베를린 올림픽 마라톤에서 우승한 손기정 선수의 시상식 사진에서 가슴의 일장기를 지워 실은 사건입니다. 동아일보 자신이 사건의 당사자가 된 이야기입니다.',
        people: ['손기정 (마라톤 선수)', '이길용 (기자)', '현진건 (사회부장, 「운수 좋은 날」 작가)', '이상범 (사진을 수정한 화가)', '송진우 (사장)'],
        tags: ['1936', '베를린 올림픽', '검열', '기자의 선택', '정간'],
        source: ['동아일보 1936. 8. 25 석간 제2판 2면'],
        caution: '구속자 명단과 인원이 자료마다 다르므로 인물 명단은 원자료 확인이 필요합니다.'
      },
      extra: {
        title: '278일의 무기정간',
        body: [
          '사진이 실린 뒤 동아일보는 278일 동안 무기정간됐고(흔히 279일로도 적음), 화가 이상범, 기자 이길용, 현진건 사회부장 등 8명이 구속됐습니다. 송진우 사장 등 3명은 자리에서 물러났습니다.',
          '사회부장 현진건은 「운수 좋은 날」의 작가입니다. 소설가가 사회부장으로서 사건을 어떻게 다뤘는지가 또 하나의 이야기가 됩니다.',
          '2026년의 짝 사례: 홍콩 빈과일보는 2021년 자진 폐간했고, 사주 지미 라이는 2026년 2월 국가보안법 위반으로 징역 20년을 선고받았습니다. 홍콩 당국은 이를 법 집행이라고 규정합니다. (신빙성 A)'
        ],
        source: '리서치 자료집 · 체육면 「손기정 일장기 말소사건」'
      },
      radio: { title: '1936년 8월, 지워진 사진', text: '1936년 8월 25일, 석간 제2판이 인쇄됩니다…' },
      transcript: null
    },
    'hyeonhaetan': { face: 'culture', hanja: '尹心悳·金祐鎭 玄海灘 事件',   // 검토필요: 당시 보도 표현은 '情死'
                      ko: '윤심덕·김우진 현해탄 사건', date: '1926.08', status: 'followup', grade: 'A',
                     desc: '목격자 없이 쓰인 기사', people: ['윤심덕', '김우진'], still: true },

    /* ===== 인물 ===== */
    'p-hyeonjingeon': { face: 'people', hanja: '社會部長 玄鎭健', ko: '사회부장 현진건', date: '1936', status: 'followup', grade: 'A',
                        desc: '소설가, 동아일보 사회부장', people: ['현진건'], person: 'hyeonjingeon' },
    'p-igilyong':     { face: 'people', hanja: '記者 李吉用', ko: '기자 이길용', date: '1936', status: 'followup', grade: 'A',
                        desc: '일장기 말소사건 기자', people: ['이길용'], person: 'igilyong' },
    'p-jangjinhong':  { face: 'people', hanja: '張鎭弘 義擧', ko: '장진홍 의거', date: '1927', status: 'followup', grade: 'B',
                        desc: '2년 넘게 보도가 금지된 폭탄 의거', people: ['장진홍', '이육사'], person: 'jangjinhong' },
    'p-okgwanbin':    { face: 'people', hanja: '玉觀彬 被殺事件', ko: '옥관빈 피살사건', date: '1933.08', status: 'followup', grade: 'B',
                        desc: '해석이 지금도 갈리는 상하이의 사건', people: ['옥관빈'], person: 'okgwanbin' },
    'p-yunsimdeok':   { face: 'people', hanja: '聲樂家 尹心悳', ko: '성악가 윤심덕', date: '1926', status: 'followup', grade: 'A',
                        desc: '음반 「사의 찬미」', people: ['윤심덕'], person: 'yunsimdeok', still: true }
  },

  /* ---------- 인물면 사진 자리 ----------
     file 이 assets/portraits 에 없으면 '사진 준비 중' 타원이 나옴
     (hyeonjingeon_portrait.jpg, igilyong_portrait.jpg 를 넣으면 자동으로 사진이 들어감)
     still: true → 아무 연출 없음 */
  people: [
    { id: 'hyeonjingeon', name: '현진건', hanjaName: '玄鎭健', role: '작가', hanjaRole: '作家', line: '「운수 좋은 날」 작가, 동아일보 사회부장', source: '',       file: 'hyeonjingeon_portrait.jpg', photo: 'images/person-hyeon-jingeon.jpg' },
    { id: 'igilyong',     name: '이길용', hanjaName: '李吉用', role: '기자', hanjaRole: '記者', line: '일장기 말소사건 당시 체육부 기자', source: '',       file: 'igilyong_portrait.jpg', photo: 'images/person-lee-gilyong.jpg' },
    { id: 'yunsimdeok',   name: '윤심덕', hanjaName: '尹心悳', role: '성악가', hanjaRole: '성악가', line: '음반 「사의 찬미」', source: '출처 확인 중',     file: 'yunsimdeok_portrait.jpg', photo: 'images/person-yun-simdeok.jpg', still: true },
    { id: 'jangjinhong',  name: '장진홍', hanjaName: '張鎭弘', role: '독립운동가', hanjaRole: '獨立運動家', line: '조선은행 대구지점 폭탄 의거', source: '출처 확인 중', file: 'jangjinhong_portrait.jpg', photo: 'images/person-jang-jinhong.jpg' },
    { id: 'okgwanbin',    name: '옥관빈', hanjaName: '玉觀彬', role: '사건 속 인물', hanjaRole: '事件 속 人物', file: 'okgwanbin_portrait.jpg', listOnly: true }
  ],

  /* ---------- 부록 (이미지 없이 글자 카드만, 실제 연관이 확인된 것만) ----------
     link: 실제 존재하는 페이지 주소를 넣으면 카드가 링크가 됨 (지금은 빈칸) */
  appendix: {
    hanja: '附錄', en: 'ARCHIVE BEYOND THE NEWS', ko: '부록',
    genres: [['詩', '시'], ['文學', '문학'], ['小說', '소설'], ['映畫', '영화'], ['冊', '책']],
    desc: ['신문에서 시작된 사건이', '소설·영화·책으로 이어진 기록'],
    /* 메인 부록 띠의 타일 5개 — 표지 이미지는 저작권 때문에 싣지 않고 활자 목록으로 */
    tiles: [
      { h: '詩',   k: '시',   items: [] },
      { h: '文學', k: '문학', items: [] },
      { h: '小說', k: '소설', items: ['『우맹』 박태원 · 1938'] },
      { h: '映畫', k: '영화', items: ['「사의 찬미」 · 1991', '드라마 · 2018'] },
      { h: '冊',   k: '책',   items: ['『경성기담』 전봉관'] }
    ],
    still: ['記錄은 지금도 이어진다', '기록은 지금도 이어진다'],
    timeline: [['一九二〇', '1920'], ['一九四〇', '1940'], ['現在', '현재']],
    lead: '기록은 다른 콘텐츠로 이어집니다',
    leadHanja: '記錄은 다른 콘텐츠로 이어집니다',
    years: ['1920', '2026'],
    flow: ['1930년대 신문 기사', '당시 소설·문학', '현대의 책', '영화·드라마'],
    cards: [
      { from: 'baekbaekgyo', kind: '소설',   title: '『우맹』',     by: '박태원', year: '1938', stage: 1, link: '' },
      { from: 'hyeonhaetan', kind: '영화',   title: '「사의 찬미」', by: '',       year: '1991', stage: 3, link: '' },
      { from: 'hyeonhaetan', kind: '드라마', title: '「사의 찬미」', by: '',       year: '2018', stage: 3, link: '' },
      { from: 'many',        kind: '책',     title: '『경성기담』', by: '전봉관', year: '2006 · 확장판 2026', stage: 2, link: '' }
    ]
  },

  /* ---------- 메인 사진 위 흔적 연출 (app.js '메인 사진 위 흔적 연출') — 시간은 초 ----------
     사진 자체는 바꾸지 않고 위에 연필·붓·그림자·필름 입자만 얹음
     fraud.numbers: 마우스를 올리면 캡션 끝 '희생자 ○○名'이 이 순서로 바뀌다 마지막에서 멈춤
       // 검토필요: 三百八十(380, 1937.6.9 지면 유골 380구) · 三百四十六(346, 1937.12.14 지면)은 프로젝트 지면 자료에 있음.
       //           三百(300) · 三百九(309)는 프로젝트 자료에서 출처를 찾지 못함 — 상세 페이지 기준은 '당시 동아일보 보도 기준 314명'
     people.skip: 누르면 연출 없이 바로 이동하는 인물 (윤심덕은 모든 연출 없음 원칙) */
  frontFx: {
    society: { word: '오보', shadowSec: 0.9, inkMax: 0.8, box: 40, reach: 10, pencilSec: 0.9, wordDelay: 0.45, lineTop: 0.07, lineBottom: 0.82 },   // 먹 얼룩: 사진 바깥 약 20~30px, 진하기 최대 0.55
    fraud:   { darkSec: 1, darkMax: 0.5, prefix: '희생자', suffix: '名', numbers: ['三百八十', '三百', '三百四十六', '三百九'], stepSec: 0.55 },
    culture: { brushSec: 0.8, brushWidth: 26, bristles: 13, color: '#e6dcc6', brushY: 0.52, brushX1: 0.08, brushX2: 0.5 },   // 붓 자국 위치: 사진 칸 폭·높이 비율
    people:  { grainSec: 1, skip: ['yunsimdeok'] }
  },

  /* ---------- 암전 바꿔치기 (30~60초에 한 번, 0.2초 어두워지는 사이 사진 하나가 바뀜) ----------
     face 면의 대표 이미지가 base 파일일 때만 alt 파일과 번갈아 바뀜. 두 파일이 모두 assets/illust에 있어야 동작.
     인물면 사진과 '당시 지면' 실제 사진에는 쓰지 않음 */
  swaps: [
    { face: 'society', base: 'shahoe_photo.png', alt: 'shahoe_photo_alt.png' },   // 아직 파일 없음
    { face: 'fraud',   base: 'sagi_pen.png',     alt: 'sagi_pen_alt.png' }        // alt 파일 없음
  ],

  /* ---------- 오프닝 (20초 자동 재생) ---------- */
  opening: {
    line: { from: 2026, to: 1924, caption: '1924년부터 1937년까지, 실제로 보도된 사건들' },
    years: [1937, 1936, 1933, 1931, 1926, 1924],
    cloud: [
      { src: 'baekbaekgyo/13', x: 280, y: 40, w: 190, h: 180 }, { src: 'baekbaekgyo/13', x: 360, y: 330, w: 110, h: 120 },
      { src: 'baekbaekgyo/12', x: 20, y: 60, w: 200, h: 220 }, { src: 'sohn-gijeong/07', x: 180, y: 20, w: 200, h: 190 },
      { src: 'sohn-gijeong/07', x: 20, y: 100, w: 150, h: 200 }, { src: 'sohn-gijeong/07', x: 220, y: 250, w: 230, h: 200 },
      { src: 'ok-gwanbin/06', x: 240, y: 20, w: 210, h: 180 }, { src: 'ok-gwanbin/03', x: 100, y: 180, w: 200, h: 170 },
      { src: 'ok-gwanbin/10', x: 20, y: 60, w: 160, h: 250 }, { src: 'manbosan/02', x: 150, y: 30, w: 150, h: 170 },
      { src: 'manbosan/02', x: 300, y: 30, w: 170, h: 140 }, { src: 'doksal-miin/04', x: 25, y: 205, w: 125, h: 190 }
    ]
  },

  /* ---------- '목록으로' 면별 옛 신문 지면 (660×920px 한 면) ----------
     단(段)은 위에서 아래로. h = 높이(px), 마지막 단은 남는 높이
     blocks 는 오른쪽에서 왼쪽 순서. w = 너비(px), 없으면 남는 너비
       { a: 사건id, size: 제목 글자 크기, cols: [[조각, ...], ...] }
       { fill: [[조각, ...]] }  { ad: 광고 조각 }  { textAd: true }
     조각: '#a'~'#d' 옛 지면 글씨 본문 / '@삽화' / '%스캔사진' / '&인물사진' / ':높이' 고정
     한 면에 사진 최대 3장, 광고는 아래쪽 1~2개 */
  layout: {
    society: [
      { h: 200, blocks: [ { fill: [['@gyeongseong_1925']], w: 360 }, { fill: [['#a'], ['#b']] } ] },
      { h: 262, blocks: [ { a: 'jukcheomjeong', w: 404, size: 32, cols: [['@jukcheom_scene:174', '#c'], ['#b']] }, { fill: [['#d']] } ] },
      { h: 196, blocks: [ { a: 'maria', w: 330, size: 25, cols: [['@maria:124', '#a'], ['#d']] }, { fill: [['#c']] } ] },
      { h: 118, blocks: [ { a: 'cheongyang', w: 150, size: 15, cols: [['#b']] }, { a: 'kim-jeongpil', w: 176, size: 15, cols: [['#a']] },
                          { a: 'manbosan', w: 150, size: 15, cols: [['#d']] }, { fill: [['#c']] } ] },
      { blocks: [ { ad: 'a3' } ] }
    ],
    fraud: [
      { h: 300, blocks: [ { a: 'baekbaekgyo', w: 420, size: 34, cols: [['@baekbaek:190', '#d'], ['&baekbaek_portrait:120', '#a']] }, { fill: [['#b']] } ] },
      { h: 270, blocks: [ { a: 'dokkaebi', w: 370, size: 30, cols: [['@dokkaebi:170', '#a'], ['#b']] }, { fill: [['#c']] } ] },
      { h: 150, blocks: [ { a: 'pyongyang-bank', w: 210, size: 17, cols: [['#c']] }, { fill: [['#d'], ['#a']] } ] },
      { blocks: [ { textAd: true, w: 160 }, { ad: 'a2' } ] }
    ],
    culture: [
      { h: 340, blocks: [ { a: 'sohn-gijeong', w: 420, size: 36, cols: [['%sohn_ceremony:230', '#a'], ['#b']] }, { fill: [['#c'], ['#d']] } ] },
      { h: 150, blocks: [ { fill: [['#b'], ['#a'], ['#c']] } ] },
      { h: 236, blocks: [ { a: 'hyeonhaetan', w: 340, size: 24, cols: [['@hyeonhaetan:150', '#d']] }, { fill: [['#a']] } ] },
      { blocks: [ { ad: 'a1', w: 170 }, { fill: [['#b']] } ] }
    ],
    people: [
      { h: 250, blocks: [ { a: 'p-hyeonjingeon', w: 312, size: 24, cols: [['&hyeonjingeon:148', '#a']] }, { a: 'p-igilyong', size: 24, cols: [['&igilyong:148', '#b']] } ] },
      { h: 250, blocks: [ { a: 'p-jangjinhong', w: 312, size: 24, cols: [['&jangjinhong_portrait:148', '#c']] }, { a: 'p-okgwanbin', size: 24, cols: [['&okgwanbin_portrait:148', '#d']] } ] },
      { h: 224, blocks: [ { a: 'p-yunsimdeok', w: 312, size: 22, cols: [['&yunsimdeok_portrait:148', '#a']] }, { fill: [['#b']] } ] },
      { blocks: [ { ad: 'a4' } ] }
    ]
  },

  /* ---------- 절제된 공포 연출 ----------
     memos : 메인 종이 여백에 숨어 있다가 전구 빛이 지나갈 때만 희미하게 보이는 검열 메모
             x, y = 종이 위 위치(%), r = 기울기, cls: box(도장 틀) / v(세로쓰기) / ink(먹색)
     flash : 20~40초에 한 번, 0.08초 동안 화면 전체로 번쩍 스치는 실제 옛 지면 */
  memos: [
    { t: '보도 금지', x: 0.6, y: 12, r: -4, cls: 'v' },
    { t: '삭제', x: 0.9, y: 46, r: 3, cls: 'v box' },
    { t: '기사 불가', x: 0.5, y: 74, r: -2, cls: 'v ink' },
    { t: '게재 보류', x: 97.4, y: 20, r: 2, cls: 'v' },
    { t: '검열필', x: 97.2, y: 58, r: -3, cls: 'v box' },
    { t: '삭제', x: 22, y: 0.4, r: -2, cls: 'box' },
    { t: '보도 금지', x: 64, y: 0.6, r: 1.5, cls: 'ink' },
    { t: '기사 불가', x: 40, y: 98.4, r: -1.5, cls: '' }
  ],
  flash: ['sohn-gijeong/05', 'ok-gwanbin/04', 'baekbaekgyo/10', 'doksal-miin/04', 'manbosan/02', 'hyeonhaetan/03'],

  /* 사기면 글로 짠 광고: {n:숫자} 는 혼자 바뀌었다 돌아옴 */
  textAd: ['급매', '황금정 가옥 한 채', '가격 {n:300} 원', '밤에는 상담 안 함', '전화 본국 {n:214} 번'],

  /* 옛 지면 글씨 본문 (assets/scans/_body — 스캔에서 글씨만 있는 부분을 흑백·같은 밝기로 맞춘 것) */
  body: { a: 'body-a.jpg', b: 'body-b.jpg', c: 'body-c.jpg', d: 'body-d.jpg', size: 430 },

  /* ---------- 스캔 조각 (assets/scans, 가로 500px 기준) ---------- */
  crops: {
    sohn_ceremony: { src: 'sohn-gijeong/05', x: 205, y: 28, w: 97, h: 128, photo: true,
                     kind: '당시 지면', title: '손기정 선수 사진', source: '동아일보 지면',
                     flag: [45, 49, 23, 18] },            // 가슴 부분 [왼쪽%, 위%, 너비%, 높이%] — 일장기 지우기 연출 자리
    sohn_hero:      { src: 'sohn-gijeong/05', x: 150, y: 26, w: 270, h: 132, photo: true, kind: '당시 지면', title: '손기정 선수 사진이 실린 지면', source: '동아일보 지면', cap: '▲1936.8.25 本紙. 손기정 선수 시상 사진 (실제 지면)' },   // cap = 메인 대표 사진 위 까만 라벨
    culture_scrap1: { src: 'sohn-gijeong/07', x: 300, y: 20, w: 180, h: 150, kind: '당시 지면', source: '동아일보 지면' },   // 문화면 콜라주용 기사 조각
    culture_scrap2: { src: 'hyeonhaetan/03', x: 240, y: 70, w: 180, h: 170 },
    a1: { src: 'poison-12days/02', x: 315, y: 440, w: 150, h: 195, kind: '당시 지면', title: '광고', source: '동아일보 지면' },           // 광고 (이미지라 한자 그대로)
    a2: { src: 'poison-12days/02', x: 165, y: 490, w: 150, h: 145 },
    a3: { src: 'doksal-miin/04',   x: 25,  y: 515, w: 450, h: 165 },
    a4: { src: 'poison-12days/01', x: 25,  y: 335, w: 450, h: 295 }
  },

  /* ---------- 사진·삽화 (assets/illust) ----------
     kind/title/source : 캡션 (sources.txt 기준)
     fx : 전구 빛이 닿거나 클릭하면 움직이는 효과
          fog 안개 / glow 불빛 / cover 불 꺼짐 / pend 흔들리는 등불 / shade 창호지 너머 그림자 / wind 미세한 흔들림
     still : 움직임 없음   real : 당시 사진(움직이지 않음) */
  illust: {
    sagi_pen:               { file: 'sagi_pen.png', w: 1344, h: 896, kind: '삽화', title: '산속 나무에 매달린 등불', source: '출처 확인 중', focus: [0.45, 0.45], fx: [] },   // 검토필요: 그림 종류(AI 재현 삽화 여부)와 출처
    gyeongseong_1925:       { file: 'gyeongseong_1925.jpg', w: 2000, h: 1502, kind: '당시 사진', title: '경성 전경(1925)', source: '서울역사아카이브 H-TRNS-75528-877', real: true, fx: [] },
    social_19330517:        { src: 'images/social-1933-05-17.jpg', w: 540, h: 442, kind: '실제 지면', title: '1933.5.17 석간 금화장 현장', cap: '▲1933.5.17 本紙 석간. 금화장 현장 (실제 지면)', real: true, raw: true, fx: [] },   // 사회면 메인 대표 사진 (cap = 사진 위 까만 라벨, raw = 이미 톤 보정됨: 필터·망점 없이 그대로)
    fraud_19400314:         { src: 'images/fraud-1940-03-14.jpg', w: 720, h: 402, kind: '실제 지면', title: '1940.3.14 석간 용수를 쓰고 법정에 선 피고들', cap: '▲1940.3.14 本紙 석간. 용수를 쓴 피고들 (실제 지면)', real: true, raw: true, fx: [] },   // 사기면 메인 대표 사진
    jukcheom_scene:         { file: 'jukcheom_scene.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '죽첨정 쓰레기 매립지의 새벽', source: 'Midjourney', focus: [0.5, 0.6], fx: [{ t: 'fog' }] },
    maria:                  { file: 'maria.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '초량정 관사의 창', source: 'Midjourney', focus: [0.62, 0.4],
                              fx: [{ t: 'glow', x: 63.5, y: 36.5, r: 9, m: 'blink' }, { t: 'cover', x: 61.4, y: 32.2, w: 4.4, h: 8.6, m: 'blink' }] },
    baekbaek:               { file: 'baekbaek.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '산속 교단의 등불', source: 'Midjourney', focus: [0.4, 0.35],
                              fx: [{ t: 'fog' }, { t: 'pend', x: 38.5, y: 0, len: 35.5, r: 11 }] },
    dokkaebi:               { file: 'dokkaebi.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '황금정 도깨비 집', source: 'Midjourney', focus: [0.52, 0.55],
                              fx: [{ t: 'shade', x: 42, y: 48, w: 20, h: 27 }] },
    bank:                   { file: 'bank.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '조선은행 평양지점', source: 'Midjourney', focus: [0.52, 0.25],
                              fx: [{ t: 'glow', x: 54.3, y: 13, r: 11, m: 'flicker' }, { t: 'cover', x: 52.4, y: 10.8, w: 3.8, h: 4.2, m: 'flicker' }] },
    okgwanbin:              { file: 'okgwanbin.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '상하이의 가스등', source: 'Midjourney',
                              fx: [{ t: 'glow', x: 28.8, y: 23.5, r: 13, m: 'sway' }, { t: 'glow', x: 58.8, y: 48.5, r: 7, m: 'sway2' }] },
    cheongyang:             { file: 'cheongyang.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', title: '박석산 낙엽더미', source: 'Midjourney', focus: [0.45, 0.6], fx: [{ t: 'wind', top: 38 }] },
    kimjeongpil:            { file: 'kimjeongpil.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', source: 'Midjourney', focus: [0.47, 0.3], fx: [{ t: 'glow', x: 46, y: 19, r: 30, m: 'breathe' }] },
    jukcheom_tram:          { file: 'jukcheom_tram.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', source: 'Midjourney', focus: [0.54, 0.55],
                              fx: [{ t: 'glow', x: 54.5, y: 61.8, r: 10, m: 'flicker' }, { t: 'cover', x: 53, y: 60.6, w: 3, h: 2.4, m: 'flicker' }] },
    jangjinhong:            { file: 'jangjinhong.jpg', w: 1280, h: 1600, kind: 'AI 재현 삽화', source: 'Midjourney', fx: [] },
    hyeonhaetan:            { file: 'hyeonhaetan.jpg', w: 960, h: 1200, kind: 'AI 재현 삽화', title: '관부연락선', source: 'Midjourney', fx: [], still: true },
    jukcheom_real01:        { file: 'jukcheom_real01.jpg', w: 1012, h: 1206, kind: '당시 사진', title: '조선금융조합연합회 본부, 죽첨정 1정목(1938)', source: '서울역사아카이브 H-TRNS-74532-888', real: true, fx: [] },
    jukcheom_map_ahyeon:    { file: 'jukcheom_map_ahyeon.jpg', w: 1592, h: 1514, kind: '당시 지도', title: '아현동 일대 지도(1936)', source: '서울역사아카이브 H-TRNS-58992-457', real: true, fx: [] },
    dokkaebi_map_hwanggeum: { file: 'dokkaebi_map_hwanggeum.jpg', w: 1007, h: 892, kind: '당시 지도', title: '경성도/조선교통지도(1924) 황금정 일대', source: '서울역사아카이브 H-TRNS-8108-329', real: true, fx: [] },
    bank_pyongyang:         { file: 'bank_pyongyang.jpg', w: 1999, h: 863, kind: '당시 사진', title: '평양시가(1925)', source: '서울역사아카이브 H-TRNS-75597-877', real: true, fx: [] },
    map_1927:               { file: 'map_1927.jpg', w: 1386, h: 2000, kind: '당시 지도', title: '경성부관내도(1927)', source: '서울역사아카이브 H-TRNS-67478-785', real: true, fx: [] }
  },

  /* ---------- 타원형 인물사진 (assets/portraits) — 절대 움직이지 않음 ---------- */
  portraits: {
    baekbaek_portrait:    { file: 'baekbaek_portrait.jpg',     kind: '당시 사진', title: '백백교 간부 이경득', source: '조선일보 호외 1937. 4. 13' },
    jangjinhong_portrait: { file: 'jangjinhong_portrait.jpg',  kind: '당시 사진', title: '장진홍', source: '신문·날짜 확인 필요' },
    okgwanbin_portrait:   { file: 'okgwanbin_portrait.jpg',    kind: '당시 사진', title: '옥관빈', source: '인물·출처 확인 필요' },
    yunsimdeok_portrait:  { file: 'yunsimdeok_portrait.jpg',   kind: '당시 사진', title: '윤심덕', source: '출처 확인 필요', still: true },
    hyeonjingeon:         { file: 'hyeonjingeon_portrait.jpg', kind: '당시 사진', title: '현진건', source: '' },
    igilyong:             { file: 'igilyong_portrait.jpg',     kind: '당시 사진', title: '이길용', source: '' }
    // maria_portrait.jpg(용의자 사진)는 무죄 선고·미제 사건이라 싣지 않음
  },

  /* ---------- '소개' 창 ---------- */
  about: {
    intent: [
      '경성야록은 자정에 도착한 1924~1937년의 호외입니다.',
      '동아일보가 실제로 보도한 사건들을 사회·사기·문화예술·인물 면으로 다시 엮었습니다.',
      '무서움은 어둠과 소리, 스스로 움직이는 신문으로만 만들고, 특정 사건 하나를 부각하지 않습니다.'
    ],
    principles: [
      '모든 사건은 당시 신문에 실제로 실린 기록에서 출발합니다. 옛 기사 문장은 지어내지 않고, 전사가 없으면 비워 둡니다.',
      '사진마다 당시 사진 · 당시 지도 · AI 재현 삽화를 구분해 밝힙니다.',
      '실제 인물의 사진은 절대 움직이지 않으며, 피해자와 무고한 사람의 사진과 이름은 싣지 않습니다.',
      '피·시신·잔혹한 장면은 직접 보여주지 않습니다. 숫자는 \'당시 동아일보 보도 기준\'처럼 출처를 밝힙니다.',
      '신빙성 등급 — A: 지면 날짜와 공신력 있는 출처로 확인 / B: 2차 출처 중심, 원문 교차 확인 필요 / C: 미검증'
    ],
    team: [
      { role: '동아일보 미디어 프론티어 부트캠프', name: 'B조 (원소스멀티유즈)' },
      { role: '기획 · 글', name: '(이름을 적어 주세요)' },
      { role: '디자인 · 개발', name: '(이름을 적어 주세요)' },
      { role: '자료 조사', name: '(이름을 적어 주세요)' }
    ]
  },

  radioPage: { title: '라디오 경성', text: '사건마다 그날의 기록을 소리로 들려주는 라디오입니다. 음원은 준비 중입니다.' }
};
