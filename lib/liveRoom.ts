export const DEMO_ROOM_CODE = "483912";
const CHANNEL_NAME = "toohak-live-room";

export interface RoomParticipant {
  id: string;
  name: string;
  joinedAt: string;
}

export interface RoomJoinMessage {
  type: "participant-joined";
  code: string;
  participant: RoomParticipant;
}

export function announceJoin(code: string, participant: RoomParticipant) {
  const message: RoomJoinMessage = { type: "participant-joined", code, participant };
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
  } catch {
    // BroadcastChannel may not be available in older embedded browsers.
  }
  localStorage.setItem(`${CHANNEL_NAME}:${code}:latest`, JSON.stringify(message));
}

export function subscribeToRoom(code: string, onJoin: (participant: RoomParticipant) => void) {
  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = event => {
      const message = event.data as RoomJoinMessage;
      if (message?.type === "participant-joined" && message.code === code) onJoin(message.participant);
    };
  } catch {
    channel = null;
  }
  const storageKey = `${CHANNEL_NAME}:${code}:latest`;
  try {
    const latest = localStorage.getItem(storageKey);
    if (latest) {
      const message = JSON.parse(latest) as RoomJoinMessage;
      if (message.type === "participant-joined" && message.code === code) onJoin(message.participant);
    }
  } catch {
    // Ignore unavailable storage or stale messages.
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) return;
    try {
      const message = JSON.parse(event.newValue) as RoomJoinMessage;
      if (message.type === "participant-joined" && message.code === code) onJoin(message.participant);
    } catch {
      // Ignore malformed messages from stale tabs.
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    channel?.close();
    window.removeEventListener("storage", onStorage);
  };
}
