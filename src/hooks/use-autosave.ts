import { useEffect, useState } from "react";
import { EDITOR_AUTOSAVE_INTERVAL } from "@/constants";

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  interval?: number;
  enabled?: boolean;
}

export function useAutosave<T>({
  data,
  onSave,
  interval = EDITOR_AUTOSAVE_INTERVAL,
  enabled = true,
}: UseAutosaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<T>(data);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  useEffect(() => {
    if (!enabled) return;

    const hasChanges = JSON.stringify(data) !== JSON.stringify(lastSavedData);
    if (!hasChanges) return;

    const saveTimeout = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveStatus("saving");
        await onSave(data);
        setLastSavedData(data);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to autosave:", error);
        setSaveStatus("error");
      } finally {
        setIsSaving(false);
      }
    }, interval);

    return () => clearTimeout(saveTimeout);
  }, [data, lastSavedData, onSave, interval, enabled]);

  return {
    isSaving,
    saveStatus,
  };
} 