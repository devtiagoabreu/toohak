import Ably from "ably";

const ablyKey = process.env.ABLY_SECRET_KEY;

if (!ablyKey) {
  throw new Error("ABLY_SECRET_KEY environment variable is not defined");
}

export const ably = new Ably.Realtime({ key: ablyKey });

export function getAblyChannel(roomId: string) {
  return ably.channels.get(`room:${roomId}`);
}
