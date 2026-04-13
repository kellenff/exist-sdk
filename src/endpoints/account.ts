import type { ExistClient } from "../client";
import type { UserProfile } from "../types";

export async function getProfile(client: ExistClient): Promise<UserProfile> {
  return client.get("/accounts/profile/") as Promise<UserProfile>;
}
