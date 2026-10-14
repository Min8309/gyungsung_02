# 경성야록 웹·모바일 게임 구현 발표

작성일: 2026-10-14 · 기준 커밋 a3f675c

코드는 실제 구현을 발표용으로 발췌·줄바꿈한 것입니다. 생략한 맥락은 각 파일에서 확인하세요.


## 1. 웹·모바일 공포 퍼즐 구현

경성야록 · 식자실

하나의 게임 로직을 웹과 모바일에서 공유하고, 기기별 입력과 화면만 분리했습니다.

- 3D 탐색 → 초록 단서 조사 → 단계별 퍼즐 → 사진 뒷면 엔딩

- HTML · CSS · JavaScript · Three.js 기반 WebGL

- 발표 자료 기준: 2026.10.14 / 커밋 a3f675c

발표 멘트: 이번 발표에서는 웹 게임을 모바일로 확장하면서 조작과 가독성을 개선한 핵심 구현을 설명합니다.


## 2. 공통 게임과 입력 계층 분리

같은 퍼즐, 다른 조작

게임 준비 이벤트를 연결점으로 삼아 모바일 입력과 지하 공간 모듈을 기존 게임에 붙였습니다.

```js

window.addEventListener('sikjasil-ready', function(event) {
  const game = event.detail;
  if (game.mobileArchive) return;
  game.mobileArchive = new GyeongArchiveSpace.ArchiveSpace(
    game, game.sceneAPI
  );
});

```

- PC: WASD·마우스·E 조사 / 모바일: 조이스틱·드래그·픽업 버튼

- 퍼즐 정답, 소지품, 방 진행, 타이머는 공통으로 사용

- 코드는 공간 연결 부분만 발췌; 실제 파일은 암실·긴장감 연출도 연결

소스: mobile-expansion/archive-bootstrap.js

발표 멘트: 기기를 따로 개발하기보다 공통 게임에 입력 어댑터를 연결해 동일한 진행 규칙을 유지했습니다.


## 3. 모바일 터치 조이스틱

작은 움직임은 무시하고 기울기에 따라 속도 조절

포인터가 조이스틱 중심에서 얼마나 벗어났는지 계산해 이동 강도로 바꿉니다.

```js

var magnitude = Math.min(length / limit, 1);
moveStrength = magnitude < .15 ? 0 : (magnitude - .15) / .85;
player.moveLeft = moveStrength ? Math.max(0, -x / limit) : false;
player.moveForward = moveStrength ? Math.max(0, -y / limit) : false;
this.walkSpeed = speed * moveStrength;

```

- 중심 15%는 데드존: 손 떨림으로 움직이는 문제 감소

- 누른 손가락을 포인터 캡처로 추적; 손을 떼면 이동 상태 초기화

- 마지막 줄은 플레이어 update 함수 발췌; 프레임 처리 후 원래 속도 복원

소스: sikjasil/assets/mobile-controls.js

발표 멘트: 화면에 방향 버튼만 놓지 않고 아날로그 조이스틱처럼 이동 강도를 적용했습니다. 조사 창을 열 때 입력도 초기화합니다.


## 4. 작은 초록 단서 조사 보조

가까이 가도 조사되지 않던 문제 해결

물체 중심 대신 실제 표면의 가까운 점을 사용하고, 거리·방향·가림을 함께 확인합니다.

```js

assistBounds.setFromObject(target);
assistBounds.clampPoint(game.camera.position, assistPoint);
assistDirection.subVectors(assistPoint, game.camera.position);
var distance = assistDirection.length();
if (distance > 2.6 || distance < .01) continue;
assistDirection.normalize();
if (assistDirection.dot(assistForward) < .15) continue;

```

- 약 2.6m 안의 전방 단서 선택을 보조; 정확한 직접 조준은 우선 유지

- 이 코드 다음의 광선 검사로 벽·숨겨진 물체를 제외

- 단서가 겹치면 목록에서 선택; PC 판정은 유지

소스: sikjasil/assets/mobile-controls.js

발표 멘트: 판정 범위를 무조건 넓히면 벽 너머 단서도 잡힙니다. 그래서 가까운 표면, 전방, 가림 검사를 결합했습니다.


## 5. 모바일 화면과 퍼즐 팝업

탐색 화면은 비우고 정보는 필요할 때 표시

상단에는 타이머만 두고 조작법·목표·소지품을 안내 버튼으로 옮겼습니다.

```js

controls.unlock();
guide.showModal();
guide.addEventListener('close', function() {
  if (!game.gameEnded && !game.ending && !document.hidden)
    controls.lock();
});

```

- 안내 창 열기/닫기 흐름의 발췌; 열 때 이동 입력도 초기화

- 타이머는 안내 중에도 계속 흐름

- 퍼즐은 화면 높이를 제한하고 내부 스크롤 적용; 사진 비교는 모바일 세로 배치

소스: sikjasil/assets/mobile-controls.js

발표 멘트: 탐색 중 안내가 공간을 가리지 않게 했습니다. 조사와 안내 중에는 이동을 멈추고, 닫으면 정상 조작으로 복귀합니다.


## 6. 자료실·암실 상태 관리

UI와 성공 조건 분리

먹지 획득·정렬·날짜 입력 조건을 상태로 관리하고, 암실은 순서와 대기 시간을 검사합니다.

```js

alignWithGuide() {
  if (!this.paper) return false;
  this.x = 2; this.y = 1; this.rotation = 0;
  return this.align();
}
// 스탬프 성공 조건 발췌
if (!this.revealed || String(code) !== '1124') {
  this.failures++; return false;
}

```

- 자료실: 먹지 얻기 → 한 번에 맞추기 → 날짜 1124

- 암실: 세척 → 붉은 등 → 현상 → 3초 대기 → 정착

- 오답·실패는 재시도 가능하며 전체 10분은 초기화하지 않음

소스: mobile-expansion/room-puzzles.js

발표 멘트: 자료실의 복잡한 회전 조작은 줄였지만 획득, 정렬, 정답 입력이라는 퍼즐 조건은 유지했습니다.


## 7. 사진 틀린그림 찾기

원본 사진을 수정하지 않는 차이 표시

같은 원본을 두 화면에 표시하고 건조본 위에 차이 표시를 겹칩니다. 원본 PNG는 그대로 보관합니다.

```js

const DIFFERENCES = [
  { mark: '押收', x: 78, y: 16, /* 힌트 생략 */ },
  { mark: '24',   x: 15, y: 82, /* 힌트 생략 */ },
  { mark: '×',    x: 53, y: 18, /* 힌트 생략 */ }
];
const CREDIT = '이 사진은 ai생성 이미지 입니다.';

```

- 좌표는 사진 내부의 백분율: 화면 크기가 바뀌어도 같은 위치

- 각 사진 차이 1곳; 초록 힌트로 강조; 완료 Set으로 중복 집계 방지

- 업로드 이미지 8장 중 3장 사용 / PC 나란히·모바일 위아래 비교

소스: mobile-expansion/missing-person.js

발표 멘트: 다른 두 장의 사진을 새로 만들기보다 화면에서 표시를 겹쳐 비교 퍼즐을 구현했습니다. 코드에 AI 생성 이미지 안내도 명시했습니다.


## 8. 모든 필수 퍼즐 완료 후 엔딩

진행 조건 검사 → 마지막 사진 뒤집기 → 종료

사진 퍼즐만으로 끝내지 않고 앞선 필수 퍼즐의 완료 상태까지 검사합니다.

```js

function canEnd(space) {
  return Boolean(
    space.archive?.unlocked && space.archive?.solved &&
    space.developed && space.missingPerson.solved
  );
}
// 엔딩 시작 흐름 발췌
 game.gameEnded = true;
 game.ghostEncounters?.stop();

```

- 서랍 → 자료실 → 암실 → 사진 3장 완료

- 마지막으로 푼 사진을 CSS rotateY와 backface-visibility로 뒤집기

- 뒷면의 다음 시즌 공포 예고 → 게임 종료 안내; 타이머와 이동 정지

소스: mobile-expansion/missing-person.js

발표 멘트: 모든 완료 조건을 충족했을 때만 엔딩으로 전환합니다. 마지막 사진에 플레이어의 실종 기사를 예고하는 문구를 남겨 여운을 만들었습니다.


## 9. 무료 모바일 테스트 앱

GitHub Pages + PWA

기존 정적 사이트에 설치 설정을 추가해 홈 화면에서 주소창 없는 앱 화면으로 실행할 수 있게 했습니다.

```json

{
  "start_url": "./?app=1",
  "scope": "./",
  "display": "standalone",
  "orientation": "landscape"
}

```

- Android Chrome: 앱 설치 / iPhone Safari: 홈 화면에 추가

- 게임 경로만 제어하는 서비스 워커; 온라인 최신 파일 우선

- 별도 앱스토어·APK 빌드 불필요; 전체 오프라인 플레이는 보장하지 않음

소스: sikjasil/manifest.webmanifest

발표 멘트: 테스트 단계에서는 네이티브 재개발 대신 무료 PWA를 선택했습니다. 설치와 실제 기기 성능 검증은 구분해서 보고했습니다.


## 10. 검증과 코드 정리

발표 결론: 조작·가독성·완료 흐름 개선

화면만 확인하지 않고 실제 터치 입력으로 시작부터 엔딩까지 자동 플레이했습니다.

```sh

node tests/mobile-full-playthrough.cjs
node tests/mobile-pickup-assist.cjs
node tests/missing-person-touch.cjs
node tests/pwa-smoke.cjs

```

- 실제 조이스틱 이동·문·계단·충돌·퍼즐·엔딩 검증 통과

- 화면 4종, 주요 페이지 12개, PWA·폰트 로딩 확인

- 미사용 구버전 파일 17개·중복 폰트 803개 정리; 약 16MB 절감

- 실제 iPhone/Android의 성능·음향·설치와 Pages 배포 완료는 별도 확인

발표 멘트: 자동 검증에서는 위치나 정답을 강제로 바꾸지 않고 조이스틱으로 끝까지 이동했습니다. 실제 기기 검증이 남아 있다는 한계도 함께 설명하겠습니다.