import Ably from "ably";

let _ably: Ably.Realtime | null = null;

export function getAbly() {
  if (_ably) return _ably;
  const ablyKey = process.env.ABLY_SECRET_KEY;
  if (!ablyKey) {
    throw new Error("ABLY_SECRET_KEY environment variable is not defined");
  }
  _ably = new Ably.Realtime({ key: ablyKey });
  return _ably;
}

export function getAblyChannel(roomId: string) {
  return getAbly().channels.get(`room:${roomId}`);
}
