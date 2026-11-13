import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_PATH } from "@/features/auth/session";

export default function Home() {
  redirect(DEFAULT_AUTHENTICATED_PATH);
}
