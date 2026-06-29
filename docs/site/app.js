const STORAGE_KEY = "ai-narrative-engine-round-state-v1";

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const PLAYERS = [
  { id: "P1", name: "Chernov Van" },
  { id: "P2", name: "Noel Rowan" },
  { id: "P3", name: "Kaney Chiakey" },
  { id: "P4", name: "Wei Feirun" }
];

const emptyInput = (player) => ({
  player_id: player.id,
  character: player.name,
  action: "",
  dialogue: "",
  intent: "",
  submitted_at: null
});

const defaultState = () => ({
  roomCode: "",
  metadata: {
    campaignTitle: "",
    sessionNumber: "",
    roundNumber: "",
    sceneSummary: ""
  },
  players: PLAYERS.reduce((acc, player) => {
    acc[player.id] = emptyInput(player);
    return acc;
  }, {})
});

let state = defaultState();
let selectedPlayerId = "P1";
let db = null;
let unsubscribeRoom = null;
let suppressMetadataSave = false;

const elements = {
  modeBadge: document.querySelector("#modeBadge"),
  storageStatus: document.querySelector("#storageStatus"),
  completionBadge: document.querySelector("#completionBadge"),
  submittedCount: document.querySelector("#submittedCount"),
  playerStatusList: document.querySelector("#playerStatusList"),
  processingOrderList: document.querySelector("#processingOrderList"),
  playerSelect: document.querySelector("#playerSelect"),
  selectedPlayerInfo: document.querySelector("#selectedPlayerInfo"),
  roomCode: document.querySelector("#roomCode"),
  campaignTitle: document.querySelector("#campaignTitle"),
  sessionNumber: document.querySelector("#sessionNumber"),
  roundNumber: document.querySelector("#roundNumber"),
  sceneSummary: document.querySelector("#sceneSummary"),
  actionInput: document.querySelector("#actionInput"),
  dialogueInput: document.querySelector("#dialogueInput"),
  intentInput: document.querySelector("#intentInput"),
  gmPrompt: document.querySelector("#gmPrompt"),
  promptReadyText: document.querySelector("#promptReadyText"),
  saveInputButton: document.querySelector("#saveInputButton"),
  clearPlayerButton: document.querySelector("#clearPlayerButton"),
  clearRoundButton: document.querySelector("#clearRoundButton"),
  copyPromptButton: document.querySelector("#copyPromptButton"),
  exportJsonButton: document.querySelector("#exportJsonButton"),
  importJsonButton: document.querySelector("#importJsonButton"),
  importJsonInput: document.querySelector("#importJsonInput")
};

function isFirebaseConfigured() {
  return Object.values(FIREBASE_CONFIG).every((value) => String(value || "").trim());
}

function isOnlineMode() {
  return Boolean(db && state.roomCode.trim());
}

function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString();
  }
  return null;
}

function normalizeInput(input, player) {
  return {
    player_id: String(input?.player_id || player.id),
    character: String(input?.character || player.name),
    action: String(input?.action || ""),
    dialogue: String(input?.dialogue || ""),
    intent: String(input?.intent || ""),
    submitted_at: normalizeTimestamp(input?.submitted_at || input?.submittedAt)
  };
}

function normalizeState(raw) {
  const next = defaultState();
  if (!raw || typeof raw !== "object") {
    return next;
  }

  next.roomCode = String(raw.roomCode || raw.room_code || "");
  next.metadata = {
    campaignTitle: String(raw.metadata?.campaignTitle || ""),
    sessionNumber: String(raw.metadata?.sessionNumber || ""),
    roundNumber: String(raw.metadata?.roundNumber || ""),
    sceneSummary: String(raw.metadata?.sceneSummary || "")
  };

  PLAYERS.forEach((player) => {
    next.players[player.id] = normalizeInput(raw.players?.[player.id], player);
  });

  return next;
}

function hasSubmitted(playerInput) {
  return Boolean(
    playerInput.action.trim() ||
      playerInput.dialogue.trim() ||
      playerInput.intent.trim()
  );
}

function getSubmittedPlayerInputs() {
  return PLAYERS.map((player) => ({
    player,
    input: state.players[player.id]
  })).filter(({ input }) => hasSubmitted(input));
}

function getProcessingOrder() {
  return getSubmittedPlayerInputs().sort((a, b) => {
    const timeA = Date.parse(a.input.submitted_at || "");
    const timeB = Date.parse(b.input.submitted_at || "");
    const safeTimeA = Number.isNaN(timeA) ? Number.MAX_SAFE_INTEGER : timeA;
    const safeTimeB = Number.isNaN(timeB) ? Number.MAX_SAFE_INTEGER : timeB;

    if (safeTimeA !== safeTimeB) {
      return safeTimeA - safeTimeB;
    }
    return a.player.id.localeCompare(b.player.id);
  });
}

function allPlayersSubmitted() {
  return getSubmittedPlayerInputs().length === PLAYERS.length;
}

function getLocalStoragePayload() {
  return {
    ...state,
    generatedPrompt: buildPrompt()
  };
}

function saveLocalState(statusText = "자동 저장됨") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getLocalStoragePayload()));
  elements.storageStatus.textContent = statusText;
}

function loadLocalState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    elements.storageStatus.textContent = "새 로컬 라운드";
    return;
  }

  try {
    state = normalizeState(JSON.parse(stored));
    elements.storageStatus.textContent = "로컬 저장 데이터 불러옴";
  } catch (error) {
    state = defaultState();
    elements.storageStatus.textContent = "로컬 저장 데이터 오류";
  }
}

function initFirebase() {
  if (!isFirebaseConfigured()) {
    setModeBadge(false);
    return;
  }
  if (!window.firebase?.initializeApp || !window.firebase?.firestore) {
    setModeBadge(false);
    elements.storageStatus.textContent = "Firebase CDN을 불러오지 못해 로컬 모드로 실행 중";
    return;
  }

  try {
    window.firebase.initializeApp(FIREBASE_CONFIG);
    db = window.firebase.firestore();
    setModeBadge(Boolean(state.roomCode.trim()));
  } catch (error) {
    db = null;
    setModeBadge(false);
    elements.storageStatus.textContent = "Firebase 초기화 실패. 로컬 모드로 실행 중";
  }
}

function setModeBadge(online) {
  elements.modeBadge.textContent = online ? "온라인 공유 모드" : "로컬 모드";
  elements.modeBadge.className = `mode-badge ${online ? "mode-online" : "mode-local"}`;
}

function getRoomRef() {
  const roomCode = state.roomCode.trim();
  if (!db || !roomCode) {
    return null;
  }
  return db.collection("trpgRooms").doc(roomCode);
}

function toFirestoreState() {
  return {
    room_code: state.roomCode.trim(),
    metadata: state.metadata,
    players: state.players,
    updated_at: new Date().toISOString()
  };
}

async function saveSharedState(statusText = "온라인 공유 저장됨") {
  const roomRef = getRoomRef();
  if (!roomRef) {
    saveLocalState(statusText);
    setModeBadge(false);
    return;
  }

  try {
    await roomRef.set(toFirestoreState(), { merge: true });
    saveLocalState("로컬 백업 저장됨");
    elements.storageStatus.textContent = statusText;
  } catch (error) {
    elements.storageStatus.textContent = "온라인 저장 실패. 로컬 백업만 저장됨";
    saveLocalState("온라인 저장 실패. 로컬 백업 저장됨");
  }
}

function saveState(statusText) {
  if (isOnlineMode()) {
    return saveSharedState(statusText);
  } else {
    saveLocalState(statusText);
    return Promise.resolve();
  }
}

function subscribeToRoom() {
  if (unsubscribeRoom) {
    unsubscribeRoom();
    unsubscribeRoom = null;
  }

  const roomRef = getRoomRef();
  if (!roomRef) {
    setModeBadge(false);
    saveLocalState("로컬 모드");
    render();
    return;
  }

  setModeBadge(true);
  elements.storageStatus.textContent = "온라인 공유 방 연결 중";

  unsubscribeRoom = roomRef.onSnapshot(
    async (snapshot) => {
      if (snapshot.exists) {
        const roomCode = state.roomCode;
        state = normalizeState({ ...snapshot.data(), roomCode });
        state.roomCode = roomCode;
        saveLocalState("온라인 데이터 로컬 백업됨");
        render();
        elements.storageStatus.textContent = "온라인 공유 데이터 동기화됨";
        return;
      }

      await roomRef.set(toFirestoreState(), { merge: true });
      elements.storageStatus.textContent = "새 온라인 공유 방 생성됨";
    },
    () => {
      setModeBadge(false);
      elements.storageStatus.textContent = "온라인 연결 실패. 로컬 모드로 계속 진행";
    }
  );
}

function syncMetadataFromFields() {
  state.roomCode = elements.roomCode.value.trim();
  state.metadata.campaignTitle = elements.campaignTitle.value;
  state.metadata.sessionNumber = elements.sessionNumber.value;
  state.metadata.roundNumber = elements.roundNumber.value;
  state.metadata.sceneSummary = elements.sceneSummary.value;
}

function syncPlayerFromFields() {
  const player = PLAYERS.find((item) => item.id === selectedPlayerId);
  state.players[selectedPlayerId] = {
    player_id: player.id,
    character: player.name,
    action: elements.actionInput.value,
    dialogue: elements.dialogueInput.value,
    intent: elements.intentInput.value,
    submitted_at: new Date().toISOString()
  };
}

function renderPlayerOptions() {
  elements.playerSelect.innerHTML = "";
  PLAYERS.forEach((player) => {
    const option = document.createElement("option");
    option.value = player.id;
    option.textContent = `${player.id}: ${player.name}`;
    elements.playerSelect.append(option);
  });
}

function renderMetadata() {
  suppressMetadataSave = true;
  elements.roomCode.value = state.roomCode;
  elements.campaignTitle.value = state.metadata.campaignTitle;
  elements.sessionNumber.value = state.metadata.sessionNumber;
  elements.roundNumber.value = state.metadata.roundNumber;
  elements.sceneSummary.value = state.metadata.sceneSummary;
  suppressMetadataSave = false;
}

function renderSelectedPlayer() {
  const player = PLAYERS.find((item) => item.id === selectedPlayerId);
  const input = state.players[selectedPlayerId];
  const submitted = hasSubmitted(input);

  elements.playerSelect.value = selectedPlayerId;
  elements.selectedPlayerInfo.innerHTML = `
    <span>${player.id}: ${player.name}</span>
    <span class="status-chip ${submitted ? "status-complete" : "status-pending"}">
      ${submitted ? "제출됨" : "미제출"}
    </span>
  `;
  elements.actionInput.value = input.action;
  elements.dialogueInput.value = input.dialogue;
  elements.intentInput.value = input.intent;
}

function renderStatus() {
  const submittedCount = getSubmittedPlayerInputs().length;
  const complete = allPlayersSubmitted();

  elements.submittedCount.textContent = `${submittedCount} / ${PLAYERS.length}`;
  elements.completionBadge.textContent = complete ? "라운드 입력 완료" : "입력 대기";
  elements.completionBadge.className = `badge ${complete ? "badge-complete" : "badge-waiting"}`;

  elements.playerStatusList.innerHTML = "";
  PLAYERS.forEach((player) => {
    const input = state.players[player.id];
    const submitted = hasSubmitted(input);
    const item = document.createElement("li");
    item.className = "status-item";
    item.innerHTML = `
      <div>
        <div class="status-name">${player.id}: ${player.name}</div>
        <div class="status-detail">${input.submitted_at ? formatTimestamp(input.submitted_at) : "저장 기록 없음"}</div>
      </div>
      <span class="status-chip ${submitted ? "status-complete" : "status-pending"}">
        ${submitted ? "제출됨" : "미제출"}
      </span>
    `;
    elements.playerStatusList.append(item);
  });
}

function renderProcessingOrder() {
  const orderedInputs = getProcessingOrder();
  elements.processingOrderList.innerHTML = "";

  if (!orderedInputs.length) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "아직 제출된 입력이 없습니다.";
    elements.processingOrderList.append(item);
    return;
  }

  orderedInputs.forEach(({ player, input }, index) => {
    const item = document.createElement("li");
    item.className = "order-item";
    item.innerHTML = `
      <div>
        <div class="order-name">${player.id}: ${player.name}</div>
        <div class="order-detail">${formatTimestamp(input.submitted_at)}</div>
      </div>
      <span class="order-chip">${index + 1}번째</span>
    `;
    elements.processingOrderList.append(item);
  });
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "저장 시간 알 수 없음";
  }
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function buildPrompt() {
  const metadata = state.metadata;
  const orderedInputs = getProcessingOrder();
  const lines = [
    "# GM / Director 라운드 처리 요청",
    "",
    `룸 / 캠페인 코드: ${state.roomCode || "(미입력)"}`,
    `캠페인: ${metadata.campaignTitle || "(미입력)"}`,
    `세션: ${metadata.sessionNumber || "(미입력)"}`,
    `라운드: ${metadata.roundNumber || "(미입력)"}`,
    "",
    "## 현재 장면 요약",
    metadata.sceneSummary || "(미입력)",
    "",
    "## 플레이어 입력",
    ""
  ];

  if (!orderedInputs.length) {
    lines.push("(제출된 플레이어 입력 없음)");
    lines.push("");
  }

  orderedInputs.forEach(({ player, input }, index) => {
    lines.push(`### ${index + 1}. ${player.id}: ${player.name}`);
    lines.push(`제출 시각: ${input.submitted_at || "(미입력)"}`);
    lines.push(`행동: ${input.action || "(미입력)"}`);
    lines.push(`대사: ${input.dialogue || "(없음)"}`);
    lines.push(`의도 / 보충 설명: ${input.intent || "(없음)"}`);
    lines.push("");
  });

  lines.push("## 처리 지시");
  lines.push("- 플레이어 입력은 제출 시간순으로 순차 처리한다.");
  lines.push("- 제출 시각이 같은 경우 player_id 순서로 처리한다.");
  lines.push("- Compiler -> Director -> Resolution/NPC/World/Mission/Shadow/Memory/QA 흐름을 사용한다.");
  lines.push("- 불확실하거나 결과가 확정되지 않은 행동은 반드시 Resolution을 거친다.");
  lines.push("- 출력은 짧은 한국어로 작성한다.");
  lines.push("- 플레이어 주도권을 보존한다. 플레이어가 선언하지 않은 행동, 감정, 대사를 작성하지 않는다.");

  return lines.join("\n");
}

function renderPrompt() {
  const complete = allPlayersSubmitted();
  elements.gmPrompt.value = buildPrompt();
  elements.copyPromptButton.disabled = !complete;
  elements.promptReadyText.textContent = complete
    ? "라운드 입력 완료. 복사할 수 있습니다."
    : "4명 입력 완료 후 복사할 수 있습니다.";
}

function render() {
  renderMetadata();
  renderSelectedPlayer();
  renderStatus();
  renderProcessingOrder();
  renderPrompt();
  setModeBadge(isOnlineMode());
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(elements.gmPrompt.value);
    elements.storageStatus.textContent = "GM 프롬프트 복사됨";
  } catch (error) {
    elements.gmPrompt.focus();
    elements.gmPrompt.select();
    document.execCommand("copy");
    elements.storageStatus.textContent = "GM 프롬프트 복사 시도됨";
  }
}

function exportRoundJson() {
  syncMetadataFromFields();
  const payload = {
    roomCode: state.roomCode,
    metadata: state.metadata,
    players: state.players,
    timestamp: new Date().toISOString(),
    generatedPrompt: buildPrompt()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const room = state.roomCode || "local";
  const session = state.metadata.sessionNumber || "session";
  const round = state.metadata.roundNumber || "round";

  link.href = url;
  link.download = `ai-narrative-engine-${room}-${session}-${round}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  saveState("JSON 내보내기 완료");
}

function validateImportShape(raw) {
  if (!raw || typeof raw !== "object") {
    return false;
  }
  if (!raw.metadata || typeof raw.metadata !== "object") {
    return false;
  }
  if (!raw.players || typeof raw.players !== "object") {
    return false;
  }
  return PLAYERS.every((player) => {
    const input = raw.players[player.id];
    return input && typeof input === "object" && "action" in input && "dialogue" in input && "intent" in input;
  });
}

function importRoundJson(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!validateImportShape(parsed)) {
        alert("가져오기 실패: 라운드 JSON 형식이 올바르지 않습니다.");
        return;
      }
      state = normalizeState(parsed);
      selectedPlayerId = "P1";
      await saveState("JSON 가져오기 완료");
      subscribeToRoom();
      render();
    } catch (error) {
      alert("가져오기 실패: JSON을 읽을 수 없습니다.");
    }
  };
  reader.readAsText(file);
}

async function clearSelectedPlayer() {
  const player = PLAYERS.find((item) => item.id === selectedPlayerId);
  if (!confirm(`${player.id}: ${player.name} 입력을 지울까요?`)) {
    return;
  }
  state.players[selectedPlayerId] = emptyInput(player);
  await saveState("선택 플레이어 입력 삭제됨");
  render();
}

async function clearEntireRound() {
  if (!confirm("전체 라운드 정보를 모두 지울까요?")) {
    return;
  }
  const roomCode = state.roomCode;
  state = defaultState();
  state.roomCode = roomCode;
  selectedPlayerId = "P1";
  await saveState("전체 라운드 삭제됨");
  render();
}

function bindEvents() {
  elements.roomCode.addEventListener("change", () => {
    syncMetadataFromFields();
    saveLocalState("룸 코드 저장됨");
    subscribeToRoom();
  });

  [elements.campaignTitle, elements.sessionNumber, elements.roundNumber, elements.sceneSummary].forEach((field) => {
    field.addEventListener("input", () => {
      if (suppressMetadataSave) {
        return;
      }
      syncMetadataFromFields();
      saveState();
      renderStatus();
      renderProcessingOrder();
      renderPrompt();
    });
  });

  elements.playerSelect.addEventListener("change", () => {
    selectedPlayerId = elements.playerSelect.value;
    renderSelectedPlayer();
  });

  elements.saveInputButton.addEventListener("click", async () => {
    syncMetadataFromFields();
    syncPlayerFromFields();
    await saveState("플레이어 입력 저장됨");
    render();
  });

  elements.clearPlayerButton.addEventListener("click", clearSelectedPlayer);
  elements.clearRoundButton.addEventListener("click", clearEntireRound);
  elements.copyPromptButton.addEventListener("click", copyPrompt);
  elements.exportJsonButton.addEventListener("click", exportRoundJson);
  elements.importJsonButton.addEventListener("click", () => elements.importJsonInput.click());
  elements.importJsonInput.addEventListener("change", () => {
    const [file] = elements.importJsonInput.files;
    if (file) {
      importRoundJson(file);
    }
    elements.importJsonInput.value = "";
  });
}

function init() {
  renderPlayerOptions();
  loadLocalState();
  initFirebase();
  bindEvents();
  subscribeToRoom();
  render();
}

init();
