const STORAGE_KEY = "ai-narrative-engine-round-state-v1";

const PLAYERS = [
  { id: "P1", name: "Chernov Van" },
  { id: "P2", name: "Noel Rowan" },
  { id: "P3", name: "Kaney Chiakey" },
  { id: "P4", name: "Wei Feirun" }
];

const emptyInput = () => ({
  action: "",
  dialogue: "",
  intent: "",
  submittedAt: null
});

const defaultState = () => ({
  metadata: {
    campaignTitle: "",
    sessionNumber: "",
    roundNumber: "",
    sceneSummary: ""
  },
  players: PLAYERS.reduce((acc, player) => {
    acc[player.id] = emptyInput();
    return acc;
  }, {})
});

let state = defaultState();
let selectedPlayerId = "P1";

const elements = {
  storageStatus: document.querySelector("#storageStatus"),
  completionBadge: document.querySelector("#completionBadge"),
  submittedCount: document.querySelector("#submittedCount"),
  playerStatusList: document.querySelector("#playerStatusList"),
  playerSelect: document.querySelector("#playerSelect"),
  selectedPlayerInfo: document.querySelector("#selectedPlayerInfo"),
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

function normalizeInput(input) {
  return {
    action: String(input?.action || ""),
    dialogue: String(input?.dialogue || ""),
    intent: String(input?.intent || ""),
    submittedAt: input?.submittedAt || null
  };
}

function normalizeState(raw) {
  const next = defaultState();
  if (!raw || typeof raw !== "object") {
    return next;
  }

  next.metadata = {
    campaignTitle: String(raw.metadata?.campaignTitle || ""),
    sessionNumber: String(raw.metadata?.sessionNumber || ""),
    roundNumber: String(raw.metadata?.roundNumber || ""),
    sceneSummary: String(raw.metadata?.sceneSummary || "")
  };

  PLAYERS.forEach((player) => {
    next.players[player.id] = normalizeInput(raw.players?.[player.id]);
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

function getSubmittedPlayers() {
  return PLAYERS.filter((player) => hasSubmitted(state.players[player.id]));
}

function allPlayersSubmitted() {
  return getSubmittedPlayers().length === PLAYERS.length;
}

function saveState(statusText = "자동 저장됨") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  elements.storageStatus.textContent = statusText;
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    elements.storageStatus.textContent = "새 라운드";
    return;
  }

  try {
    state = normalizeState(JSON.parse(stored));
    elements.storageStatus.textContent = "저장된 라운드 불러옴";
  } catch (error) {
    state = defaultState();
    elements.storageStatus.textContent = "저장 데이터 오류";
  }
}

function syncMetadataFromFields() {
  state.metadata.campaignTitle = elements.campaignTitle.value;
  state.metadata.sessionNumber = elements.sessionNumber.value;
  state.metadata.roundNumber = elements.roundNumber.value;
  state.metadata.sceneSummary = elements.sceneSummary.value;
}

function syncPlayerFromFields() {
  state.players[selectedPlayerId] = {
    action: elements.actionInput.value,
    dialogue: elements.dialogueInput.value,
    intent: elements.intentInput.value,
    submittedAt: new Date().toISOString()
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
  elements.campaignTitle.value = state.metadata.campaignTitle;
  elements.sessionNumber.value = state.metadata.sessionNumber;
  elements.roundNumber.value = state.metadata.roundNumber;
  elements.sceneSummary.value = state.metadata.sceneSummary;
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
  const submittedCount = getSubmittedPlayers().length;
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
        <div class="status-detail">${input.submittedAt ? formatTimestamp(input.submittedAt) : "저장 기록 없음"}</div>
      </div>
      <span class="status-chip ${submitted ? "status-complete" : "status-pending"}">
        ${submitted ? "제출됨" : "미제출"}
      </span>
    `;
    elements.playerStatusList.append(item);
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
  const lines = [
    "# GM / Director 라운드 처리 요청",
    "",
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

  PLAYERS.forEach((player) => {
    const input = state.players[player.id];
    lines.push(`### ${player.id}: ${player.name}`);
    lines.push(`행동: ${input.action || "(미입력)"}`);
    lines.push(`대사: ${input.dialogue || "(없음)"}`);
    lines.push(`의도 / 보충 설명: ${input.intent || "(없음)"}`);
    lines.push("");
  });

  lines.push("## 처리 지시");
  lines.push("- 플레이어 입력은 P1 -> P2 -> P3 -> P4 순서로 순차 처리한다.");
  lines.push("- Compiler -> Director -> Resolution/NPC/World/Mission/Shadow/Memory/QA 흐름을 사용한다.");
  lines.push("- 불확실하거나 결과가 확정되지 않은 행동은 반드시 Resolution을 거친다.");
  lines.push("- 출력은 짧은 한국어로 작성한다.");
  lines.push("- 플레이어 주도권을 보존한다. 플레이어가 선언하지 않은 행동, 감정, 대사를 작성하지 않는다.");

  return lines.join("\n");
}

function renderPrompt() {
  const complete = allPlayersSubmitted();
  const prompt = buildPrompt();
  elements.gmPrompt.value = prompt;
  elements.copyPromptButton.disabled = !complete;
  elements.promptReadyText.textContent = complete
    ? "라운드 입력 완료. 복사할 수 있습니다."
    : "4명 입력 완료 후 복사할 수 있습니다.";
}

function render() {
  renderMetadata();
  renderSelectedPlayer();
  renderStatus();
  renderPrompt();
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
  const session = state.metadata.sessionNumber || "session";
  const round = state.metadata.roundNumber || "round";

  link.href = url;
  link.download = `ai-narrative-engine-${session}-${round}.json`;
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
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!validateImportShape(parsed)) {
        alert("가져오기 실패: 라운드 JSON 형식이 올바르지 않습니다.");
        return;
      }
      state = normalizeState(parsed);
      selectedPlayerId = "P1";
      saveState("JSON 가져오기 완료");
      render();
    } catch (error) {
      alert("가져오기 실패: JSON을 읽을 수 없습니다.");
    }
  };
  reader.readAsText(file);
}

function clearSelectedPlayer() {
  const player = PLAYERS.find((item) => item.id === selectedPlayerId);
  if (!confirm(`${player.id}: ${player.name} 입력을 지울까요?`)) {
    return;
  }
  state.players[selectedPlayerId] = emptyInput();
  saveState("선택 플레이어 입력 삭제됨");
  render();
}

function clearEntireRound() {
  if (!confirm("전체 라운드 정보를 모두 지울까요?")) {
    return;
  }
  state = defaultState();
  selectedPlayerId = "P1";
  saveState("전체 라운드 삭제됨");
  render();
}

function bindEvents() {
  [elements.campaignTitle, elements.sessionNumber, elements.roundNumber, elements.sceneSummary].forEach((field) => {
    field.addEventListener("input", () => {
      syncMetadataFromFields();
      saveState();
      renderStatus();
      renderPrompt();
    });
  });

  elements.playerSelect.addEventListener("change", () => {
    selectedPlayerId = elements.playerSelect.value;
    renderSelectedPlayer();
  });

  elements.saveInputButton.addEventListener("click", () => {
    syncPlayerFromFields();
    saveState("플레이어 입력 저장됨");
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
  loadState();
  bindEvents();
  render();
}

init();
