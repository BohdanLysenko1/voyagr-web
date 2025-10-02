"use client";

import { useRouter } from "next/navigation";
import SettingsModal from "../../components/Settings/SettingsModal";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <SettingsModal
        open={true}
        onClose={() => {
          // Prefer going back if possible; fallback to home.
          if (window.history.length > 1) router.back();
          else router.push("/");
        }}
      />
    </ProtectedRoute>
  );
}
