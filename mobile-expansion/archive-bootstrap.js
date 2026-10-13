/* Shared PC/mobile spaces; each platform keeps its native input controls. */
(function(){
'use strict';
window.addEventListener('sikjasil-ready',function(event){const game=event.detail;if(game.mobileArchive)return;game.mobileArchive=new GyeongArchiveSpace.ArchiveSpace(game,game.sceneAPI);game.mobileDarkroom=new GyeongDarkroomSpace.DarkroomSpace(game,game.sceneAPI,game.mobileArchive);game.ghostEncounters.resolvePlace=place=>SikjasilGhosts.resolveExpandedPlace(game.camera.position,game.camera.getWorldDirection(new game.sceneAPI.Vector3()),game.ghostEncounters.random,place);game.tensionDirector=new GyeongTension.TensionDirector(game);
// Opening the corridor door no longer starts the final ending: keep the space available for further puzzles.
game.beginScreamingRoomEnding=()=>{game.interactionManager.triggerInspect({type:'drying_missing_note',clueId:'drying_future_room',name:'열린 윤전기실 문',description:'문은 열렸지만 기록은 아직 끝나지 않았다. 지하 사진 건조방의 초록 집게 사진을 찾아보세요. 다음 퍼즐이 추가될 때까지 탐색을 계속할 수 있습니다.'});};
game.ghostEncounters.isAllowed=()=>game.playerControls.controls.isLocked&&!game.interactionManager.isInspecting&&!game.notebookUI.isOpen&&!game.gameEnded&&!game.ending&&game.startScreen.classList.contains('hidden')&&!document.getElementById('reward-card-modal')?.classList.contains('active')&&!document.querySelector('.gp-room-effect');game.playerControls.controls.addEventListener('unlock',()=>{if(game.ghostEncounters.active)game.ghostEncounters.lastEncounter=performance.now();game.ghostEncounters.hide();});window.addEventListener('space-inspect',()=>game.ghostEncounters.hide());});
})();
