import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  users,
  recoveryCodes,
  userProfiles,
  userSmtpConfigs,
  userApiKeys,
} from "@/db/schema";
import { decrypt } from "@/lib/encryption";

export async function getUserById(userId: string) {
  return await getDb().query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      profile: true,
    },
  });
}

export async function generateRecoveryCodes(userId: string): Promise<string[]> {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(
      Array.from({ length: 8 }, () =>
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[
          Math.floor(Math.random() * "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".length)
        ]
      ).join("")
    );
  }

  await getDb().insert(recoveryCodes).values(
    codes.map((code) => ({
      userId,
      code,
      used: false,
    }))
  );

  return codes;
}

export async function verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
  const recoveryCode = await getDb().query.recoveryCodes.findFirst({
    where: eq(recoveryCodes.code, code),
  });

  if (!recoveryCode || recoveryCode.userId !== userId || recoveryCode.used) {
    return false;
  }

  await getDb().update(recoveryCodes).set({ used: true }).where(eq(recoveryCodes.id, recoveryCode.id));
  return true;
}

export async function getUserSmtpConfig(userId: string) {
  const config = await getDb().query.userSmtpConfigs.findFirst({
    where: eq(userSmtpConfigs.userId, userId),
  });

  if (!config) return null;

  const decryptedPassword = await decrypt(config.appPasswordEncrypted);

  return {
    id: config.id,
    email: config.email,
    appPassword: decryptedPassword,
    provider: config.provider,
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
    isVerified: config.isVerified,
  };
}

export async function getUserApiKeys(userId: string) {
  return await getDb().query.userApiKeys.findMany({
    where: eq(userApiKeys.userId, userId),
    orderBy: (apiKeys: any, { asc }: any) => [asc(apiKeys.priorityOrder)],
  });
}

export async function getProfileByUserId(userId: string) {
  return await getDb().query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });
}
