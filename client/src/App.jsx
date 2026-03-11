import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { DraftProvider, useDraft, PHASE } from "./context/DraftContext";
import TeamSelector from "./components/TeamSelector";
import DraftBoard from "./components/DraftBoard";
import DraftComplete from "./components/DraftComplete";

function AppContent() {
  const { phase, initDraft } = useDraft();

  // Load players + teams from backend on mount
  useEffect(() => {
    initDraft();
  }, [initDraft]);

  return (
    <div className="min-h-screen">
      {phase === PHASE.SETUP && <TeamSelector />}
      {phase === PHASE.DRAFTING && <DraftBoard />}
      {phase === PHASE.COMPLETE && <DraftComplete />}
    </div>
  );
}

export default function App() {
  return (
    <DraftProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />
      <AppContent />
    </DraftProvider>
  );
}