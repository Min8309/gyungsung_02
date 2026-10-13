# 경성야록 공유 지하 퍼즐 모듈

PC·모바일은 `/sikjasil/`에서 같은 퍼즐 상태와 공간을 사용합니다. 모바일은 조이스틱·화면 드래그·픽업 버튼, PC는 WASD·마우스·E 조사로 조작합니다. 전체 제한 시간 10분은 방 이동이나 재시도로 초기화되지 않습니다.

## 필수 진행과 엔딩

1. 식자실 24번 서랍 암호 `2358` → 오른쪽 자료실 문 열기.
2. 계단 아래 중앙 책상: 먹지 얻기 → 한 번에 정렬 → 날짜 `1124` 스탬프 → 암실 열쇠.
3. 자료실 끝 검은 커튼: 철문 열기 → 암실 인화 작업대 조사.
4. 필름 세척 → 붉은 안전등 → 현상액 → 3초 기다림 → 정착액. 실패하면 약품을 다시 채웁니다.
5. 두 번째 커튼 → 사진 건조방 왼쪽 벽의 초록 집게 사진 3장.
6. 원본과 건조본 비교: 사진 1 오른쪽 위 압수 도장, 사진 2 왼쪽 아래 24, 사진 3 위쪽 가운데 ×를 찾습니다.
7. 서랍·자료실·암실·사진 세 장을 모두 완료하면 마지막으로 푼 사진이 뒤집히고, 뒷면의 공포스러운 다음 시즌 예고와 게임 종료 안내를 표시합니다. 타이머·귀신 연출·이동이 멈춥니다. 재시작은 새로고침입니다.

사진 원본은 사용자가 제공한 PNG이며 AI 생성 이미지 참고 문구를 표시합니다. 이미지 출처와 교체 파일은 [이미지 안내](assets/missing-person/README.md)를 참고하세요. 게임 화면에서 차이 표시만 덧붙이며 원본 파일은 수정하지 않습니다.

## 모바일 화면과 조사

탐색 중 상단에는 타이머만 표시합니다. 왼쪽 아래 ‘플레이 안내’에서 조작법·현재 목표·소지품·무료 PWA 설치 안내를 확인합니다. 안내 중에도 제한 시간은 흐릅니다. 사진방 입장 안내는 PC에서 한 번 표시하고 모바일에서는 안내 버튼으로 확인합니다.

모바일의 작은 초록 단서는 정확히 겨냥하지 않아도 전방 약 2.6m 이내에서 조사 보조가 적용됩니다. 숨겨진 물체·후방·벽 너머는 제외합니다. 여러 단서가 겹치면 픽업 버튼으로 목록을 열어 원하는 퍼즐을 고릅니다. PC는 기존 조준 방식을 유지합니다.

퍼즐 팝업은 내부 스크롤로 읽습니다. PC 사진 비교는 나란히, 좁은 모바일은 위아래로 표시합니다. 틀려도 이전 진행을 잃지 않으며 초록 힌트를 바로 볼 수 있습니다.

## 파일 구성

- `mobile-expansion.js`: 단계 상태·타이머 연결·퍼즐 공통 UI와 독립 미리보기.
- `room-puzzles.js` / `.css`: 자료실·암실 퍼즐과 공통 조사 화면.
- `archive-space.js`: 자료실 문·계단·책상·충돌·단서.
- `darkroom-space.js`: 암실·건조방·커튼·사진과 단서 연결.
- `missing-person.js`: 틀린그림 찾기·마지막 사진 뒤집기·최종 엔딩.
- `tension-director.js`: 위치 음향과 사진 변화 연출.
- `archive-bootstrap.js`: 식자실 `sikjasil-ready` 이벤트와 공유 공간 연결.

윤전기실의 별도 3D 공간은 아직 없습니다. 독립 `preview.html`의 윤전기실 단계는 모듈 개발용입니다. `archive-preview.html`은 PC에서도 모바일 조작을 체험할 수 있는 기존 게임 미리보기입니다.

## 실행과 검증

저장소 루트에서 `python3 -m http.server 8000 --bind 127.0.0.1`을 실행합니다. 테스트는 Node.js, Playwright와 `/usr/bin/chromium`을 사용합니다. 다른 서버 주소는 `GAME_TEST_URL`로 지정합니다. 아래 명령은 저장소 루트에서 실행합니다.

```sh
node --test tests/missing-person.test.cjs tests/ghost-plan.test.cjs
node tests/archive-puzzle-help.cjs
node tests/missing-person-touch.cjs
node tests/mobile-guide.cjs
node tests/mobile-pickup-assist.cjs
node tests/missing-person-game.cjs
node tests/mobile-full-playthrough.cjs
node tests/pwa-smoke.cjs
```

브라우저 테스트는 소프트웨어 렌더링 부하를 줄이기 위해 순서대로 실행하세요. `missing-person-game.cjs`는 PC·모바일 퍼즐 연결을 관찰 위치 조정으로 검증하며 `GAME_TEST_PLATFORM=mobile`로 모바일만 실행할 수 있습니다. `mobile-full-playthrough.cjs`는 위치·정답·소지품을 강제로 설정하지 않고 실제 터치 조이스틱과 충돌 처리를 거쳐 시작부터 엔딩까지 이동합니다. 자동화는 시점 방향을 조절하고 테스트용으로만 그래픽 해상도를 낮춥니다.

모바일 화면 4종의 터치·스크롤·안내와 세로/가로 팝업, 조사·힌트·오답·완료·사진 회전·종료 문구를 검증합니다. 실제 iOS Safari·Android 기기의 성능·음향은 별도 확인이 필요합니다.
