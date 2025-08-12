"use client";

import { useRouter } from "next/navigation";
import SettingsModal from "../../components/Settings/SettingsModal";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <SettingsModal
      open={true}
      onClose={() => {
        // Prefer going back if possible; fallback to home.
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
    />
  );
}
