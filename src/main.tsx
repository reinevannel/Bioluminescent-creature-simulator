import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router, usePath } from "./lib/nav";
import { LabProvider } from "./features/aequor/lab-context";
import { AppShell } from "./features/aequor/shell";
import { LabView } from "./features/aequor/lab-view";
import { ArchiveView } from "./features/aequor/archive-view";
import { EvolutionView } from "./features/aequor/evolution-view";
import { DesignView } from "./features/aequor/design-view";
import "./styles.css";

function Page() {
  const path = usePath();
  if (path === "/archive") return <ArchiveView />;
  if (path === "/evolution") return <EvolutionView />;
  if (path === "/design") return <DesignView />;
  return <LabView />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <LabProvider>
        <AppShell>
          <Page />
        </AppShell>
      </LabProvider>
    </Router>
  </StrictMode>,
);
