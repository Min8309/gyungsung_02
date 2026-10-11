/* =========================================================================
   경성야록 부록 — 京城事件博覽會 (경성사건박람회)
   ▶ expo-data.js : 글자 · 사진 경로 · 전시관 · 작품 데이터
   -------------------------------------------------------------------------
   이 파일만 고치면 화면 내용이 바뀝니다. (모양은 expo.css, 동작은 expo.js)
   반드시 expo.js 보다 먼저 불러와야 합니다. (expo.html 맨 아래 순서 참고)

   [사실 확인 원칙]
   · 작품 정보는 「경성야록_리서치자료집_지면별.pdf」와 공개 자료에서 확인된 것만 넣습니다.
   · 확인이 덜 끝난 항목은 verify: true → 화면에 '다른 문헌에 의함'이 붙습니다.
   · 1990년 이후 작품(recent: true)은 포스터·장면 없이 제목 · 연도 · 찾아보기 링크만 보입니다.
   · 실존 피해자 · 무고한 사람의 얼굴 사진은 넣지 않습니다.
   · still: true → 그 작품 · 사건에는 어떤 움직임 연출도 붙지 않습니다. (윤심덕 · 김우진 관련 원칙)
   ========================================================================= */

window.EXPO = {

  /* ---------------------------------------------------------------------
     1. 기본 설정
     --------------------------------------------------------------------- */
  config: {
    // 제호 한자 표기 — 최신 메인(index.html)은 京城野錄, data.js 는 京城夜錄 으로 서로 다름.
    // 하나로 정한 뒤 여기만 바꾸면 박람회 페이지 전체가 따라 바뀝니다.
    brandKo: '경성야록',
    brandHj: '京城野錄',

    // 본지(메인) 파일 주소 — '본지로 돌아가기' 버튼이 이 주소로 갑니다.
    // #appendix = 메인 아래쪽 '부록' 서가 칸 (메인에서 들어온 그 자리로 돌아감)
    mainPage: 'index.html#appendix',

    // 사건으로 가는 주소 — '이 작품이 태어난 지면 →' · 족보 '지면으로' 링크
    // · 지금 메인(index.html 한 장짜리): 1면 사건 칸에 id="case-사건id" 를 달아 둠 → 그 칸으로 내려감
    // · 1면 칸이 없는 사건(현해탄)은 '각면 기록' 색인(#index)으로
    // · 나중에 서버용 메인(#a/사건id 상세 페이지)으로 바꾸면 아래 return 줄만
    //   return 'index.html#a/' + caseId;  로 바꾸면 됩니다.
    caseLink: function (caseId) {
      var onFront = ['jukcheomjeong', 'maria', 'sohn-gijeong', 'baekbaekgyo'];   // 메인 1면에 칸이 있는 사건
      return onFront.indexOf(caseId) > -1 ? 'index.html#case-' + caseId : 'index.html#index';
    },

    // 사진 폴더와 확장자 — 파일을 assets 폴더에 '이름.png'로 넣으면 자동으로 쓰입니다.
    // .png 가 없으면 .jpg 를 한 번 더 찾아봅니다. (expo.js 의 loadImg 참고)
    assetDir: 'assets/',

    // 관람 도장 수첩이 브라우저에 기억되는 이름 (바꾸면 모든 관람 기록이 처음부터 다시 시작)
    storageKey: 'gsyr-expo-stamps-v1',

    // 6관을 모두 돌면 나오는 할인권 — 상점 쪽에서 정한 내용으로 바꿔 넣으세요.
    coupon: {
      shopKo: '경성야록 상점',
      shopHj: '京城野錄 商店',
      code: 'JAJEONG-1929',            // 할인 코드 (임시)
      note: '할인 내용은 상점 공지를 따릅니다'
    }
  },

  /* ---------------------------------------------------------------------
     2. 1929년 조선박람회 실제 정보
     출처: 「朝鮮博覽會案內」 안내문과 그 해석 (참고 블로그 quixcha 「조선박람회 안내 1929」 캡처)
     ※ 화면 '관람 안내' 칸에 그대로 쓰입니다. 숫자를 바꾸지 마세요.
     --------------------------------------------------------------------- */
  expo1929: {
    period: '1929. 9. 12 ~ 10. 31',          // 회기
    periodHj: '昭和四年 九月 十二日 ~ 十月 三十一日',
    place: '경복궁',                          // 회장
    placeHj: '景福宮',
    scale: '직영관 10여 개 · 특설관 80여 개',   // 회장 규모
    scaleHj: '直營館 十餘 · 特設館 八十餘'
  },

  // 당시 입장료 — 위 세 줄은 개인, 아래 세 줄은 단체
  fee1929: [
    { ko: '대인',                         hj: '大人',               price: '30전', priceHj: '三十錢' },
    { ko: '소아',                         hj: '小兒',               price: '15전', priceHj: '十五錢' },
    { ko: '군인',                         hj: '軍人',               price: '20전', priceHj: '二十錢' },
    { ko: '학교 아동 (직원 인솔)',         hj: '學校兒童 (職員 引率)', price: '10전', priceHj: '十錢', group: true },
    { ko: '군인 · 학생 (20인 이상 인솔)',  hj: '軍人·學生 (二十人 以上)', price: '15전', priceHj: '十五錢', group: true },
    { ko: '일반 단체 (20인 이상)',         hj: '一般團體 (二十人 以上)', price: '20전', priceHj: '二十錢', group: true }
  ],

  /* ---------------------------------------------------------------------
     3. 전시관 6개
     id    : 주소(#hall/id)와 작품의 hall 값에 쓰는 이름
     ko/hj : 기본은 한글, 마우스를 올리면 한자
     kind  : 무엇을 모은 관인지 한 줄
     img   : assets 폴더의 관 사진 이름 (확장자 빼고)
     x, y  : 회장안내도(expo-map) 위 명패 위치. 지도 가로 · 세로를 100으로 본 %값.
             지도 사진을 바꾸면 이 숫자만 옮겨서 맞추면 됩니다.
     isNew : 2026의 빛이 새어 나오는 관 (신세대관 하나만)
     --------------------------------------------------------------------- */
  pavilions: [
    { id: 'literature', ko: '문학관',     hj: '文學館',     kind: '소설 · 연재소설 · 시',         img: 'pav-literature', x: 45, y: 26 },
    { id: 'film',       ko: '활동사진관', hj: '活動寫眞館', kind: '영화',                         img: 'pav-film',       x: 61, y: 37 },
    { id: 'music',      ko: '창가관',     hj: '唱歌館',     kind: '노래 · 음반',                  img: 'pav-music',      x: 44, y: 41 },
    { id: 'stage',      ko: '무대관',     hj: '舞臺館',     kind: '연극 · 뮤지컬 · 오페라',       img: 'pav-stage',      x: 64, y: 67 },
    { id: 'art',        ko: '미술관',     hj: '美術館',     kind: '그림 · 사진',                  img: 'pav-art',        x: 41, y: 72 },
    { id: 'new',        ko: '신세대관',   hj: '新世代館',   kind: '드라마 · 웹툰 · 게임',          img: 'pav-new',        x: 92, y: 55, isNew: true }
  ],

  /* ---------------------------------------------------------------------
     4. 사건 (족보의 맨 위 뿌리)
     id     : 메인 data.js 의 articles 이름과 똑같이 맞춰야 '지면으로' 링크가 이어집니다.
     face   : 실린 면 (메인 지면 목차와 같은 이름)
     date   : 메인 data.js 의 date 와 같은 값
     still  : 움직임 연출 금지 (윤심덕 · 김우진)
     --------------------------------------------------------------------- */
  cases: [
    { id: 'hyeonhaetan',   ko: '윤심덕·김우진 현해탄 정사',   hj: '尹心悳·金祐鎭 玄海灘 情死', face: '문화예술', faceHj: '文化藝術', date: '1926', still: true },
    { id: 'maria',         ko: '부산 마리아 참살 사건',      hj: '釜山 마리아 慘殺事件',       face: '사회',     faceHj: '社會',     date: '1931.08.04' },
    { id: 'jukcheomjeong', ko: '죽첨정 단두유아 사건',       hj: '竹添町 斷頭乳兒 事件',       face: '사회',     faceHj: '社會',     date: '1933.05.17' },
    { id: 'sohn-gijeong',  ko: '손기정 일장기 말소사건',     hj: '孫基禎 日章旗 抹消事件',     face: '문화예술', faceHj: '文化藝術', date: '1936.08.25' },
    { id: 'baekbaekgyo',   ko: '백백교 사건',                hj: '白白敎 事件',                face: '경제',     faceHj: '經濟',     date: '1937.06.08' }
  ],

  /* ---------------------------------------------------------------------
     5. 작품 (진열품)
     case   : 위 cases 의 id — 어느 사건에서 태어났는지
     hall   : 위 pavilions 의 id — 어느 관에 놓이는지
     shape  : 진열품 모양
              book   = 책 표지        record = 레코드 라벨     flyer = 극장 전단
              sched  = 편성표 조각    frame  = 액자 (그림 · 사진)
     img    : assets 폴더의 사진 이름 (없으면 코드로 그린 틀만 보임)
     line   : 사건을 어떻게 그렸나 한 줄 — 자료로 확인된 내용만
     recent : true 면 포스터 · 장면 없이 제목 · 연도 · 링크만
     link   : 찾아보기 주소 (recent 작품용 — 지금은 검색 결과 주소)
     verify : true 면 '다른 문헌에 의함' 표시
     src    : 근거 (화면에는 안 보이고, 메모)
     --------------------------------------------------------------------- */
  works: [

    /* ── 윤심덕 · 김우진 현해탄 정사 (1926) ── */
    {
      id: 'sachan-sp', case: 'hyeonhaetan', hall: 'music', shape: 'record', img: 'art-sachan-sp', still: true,
      title: '사의 찬미', titleHj: '死의 讚美', year: 1926, genre: '음반', maker: '노래 윤심덕',
      line: '윤심덕이 노래한 음반. 경성야록은 이 사건을 낭만화하지 않고 경위만 담담히 전한다.',
      src: '리서치 자료집 9쪽 「사건 옆의 문인들」 · 음반 「사의 찬미」'
    },
    {
      id: 'film-yunsimdeok-1969', case: 'hyeonhaetan', hall: 'film', shape: 'flyer', still: true,
      title: '윤심덕', titleHj: '尹心悳', year: 1969, genre: '영화', maker: '주연 문희',
      line: '두 사람의 이야기를 삼각관계와 본처 · 혼외 여성의 갈등을 축으로 한 멜로로 옮겼다.',
      src: '정우숙, 「윤심덕과 김우진 소재 영상물 비교 및 영화 <사의 찬미>(1991) 재론」, 대중서사연구 26-4 (2020)'
    },
    {
      id: 'film-sachan-1991', case: 'hyeonhaetan', hall: 'film', recent: true, still: true,
      title: '사의 찬미', year: 1991, genre: '영화',
      link: 'https://search.naver.com/search.naver?query=%EC%98%81%ED%99%94+%EC%82%AC%EC%9D%98+%EC%B0%AC%EB%AF%B8+1991',
      src: '메인 data.js 부록 카드 · 대중서사연구 26-4'
    },
    {
      id: 'drama-sachan-2018', case: 'hyeonhaetan', hall: 'new', recent: true, still: true,
      title: '사의 찬미', year: 2018, genre: '드라마',
      link: 'https://search.naver.com/search.naver?query=%EB%93%9C%EB%9D%BC%EB%A7%88+%EC%82%AC%EC%9D%98+%EC%B0%AC%EB%AF%B8+2018',
      src: '메인 data.js 부록 카드 · 대중서사연구 26-4'
    },

    /* ── 손기정 일장기 말소사건 (1936) ── */
    {
      id: 'sohn-erased-photo', case: 'sohn-gijeong', hall: 'art', shape: 'frame', img: 'art-leesangbeom',
      title: '지워진 표식', titleHj: '抹消된 標識', year: 1936, genre: '보도사진 (수정)', maker: '화가 이상범 · 기자 이길용 외',
      line: '8월 25일자 석간 2면에 일장기를 완전히 지운 시상식 사진이 실렸고, 신문은 279일 동안 무기정간됐다.',
      src: '리서치 자료집 9쪽 체육면 · 「사진을 수정한 화가 이상범」'
    },
    {
      id: 'film-boston-2023', case: 'sohn-gijeong', hall: 'film', recent: true,
      title: '1947 보스톤', year: 2023, genre: '영화',
      link: 'https://search.naver.com/search.naver?query=%EC%98%81%ED%99%94+1947+%EB%B3%B4%EC%8A%A4%ED%86%A4',
      verify: true,   // 손기정이 등장하는 영화
      src: '공개 자료'
    },

    /* ── 백백교 사건 (1937) ── */
    {
      id: 'umaeng', case: 'baekbaekgyo', hall: 'literature', shape: 'book', img: 'art-parktaewon',
      title: '우맹', titleHj: '愚氓', year: 1938, genre: '신문 연재소설', maker: '박태원',
      line: '교주를 잔혹한 살인자이자 아들에게 자애로운 아버지로 함께 세워, 사람의 이중성을 파고들었다. 뒤에 장편 『금은탑』으로 고쳐 펴냈다.',
      src: '리서치 자료집 6쪽 · 9쪽 / 매일신문 「박태원의 우맹과 백백교 사건」 / 교보문고 학술 「실화소설 금은탑 다시 읽기」'
    },
    {
      id: 'gyeryongsan', case: 'baekbaekgyo', hall: 'literature', shape: 'book',
      title: '계룡산', titleHj: '鷄龍山', year: 1964, genre: '대중소설', maker: '박용구',
      line: '백백교를 다룬 대중소설. 박태원의 『금은탑』이 앞선 본보기로 꼽힌다.',
      verify: true,
      src: '교보문고 학술 「박태원의 장르실험과 재앙의 상상력」 초록 (자료집에는 아직 없음)'
    },
    {
      id: 'novel-baekbaek-1989', case: 'baekbaekgyo', hall: 'literature', shape: 'book',
      title: '백백교', titleHj: '白白敎', year: 1989, genre: '대중소설', maker: '이문현',
      line: '백백교를 다룬 대중소설.',
      verify: true,
      src: '교보문고 학술 초록 (자료집에는 아직 없음)'
    }

    /* ── 마리아 참살 · 죽첨정 사건 ──
       자료집에서 파생 작품을 찾지 못해 비워 둡니다. 확인되면 위와 같은 모양으로 추가하세요.
       (비어 있으면 족보에 '파생 작품 없음'이 자동으로 보입니다) */
  ]
};
