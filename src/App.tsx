import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import DownloadLinux from "./pages/DownloadLinux";
import DownloadWindows from "./pages/DownloadWindows";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

/**
 * Scroll the window to the top on every route change so landing on Privacy /
 * Terms / Contact never shows a scrolled-down viewport inherited from the
 * previous page. Kept colocated with the router for discoverability.
 */
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === "/") return undefined;
  return base.replace(/\/$/, "");
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <ScrollToTopOnNavigate />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download/windows" element={<DownloadWindows />} />
        <Route path="/download/linux" element={<DownloadLinux />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}
