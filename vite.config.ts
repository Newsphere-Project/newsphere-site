import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub *project* pages are served as https://<user>.github.io/<repo>/  — the app
// must be built with the correct root path so asset URLs and the router work:
//   VITE_BASE_PATH=/<repo>/ npm run build
// (User/org site `https://<user>.github.io/` without a subpath: omit or use / .)
// https://vite.dev/guide/build.html#public-base-path
function publicBasePath(): string {
  const b = process.env.VITE_BASE_PATH;
  if (!b || b === "/") return "/";
  const withLead = b.startsWith("/") ? b : `/${b}`;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
}

// https://vite.dev/config/
export default defineConfig({
  base: publicBasePath(),
  plugins: [tailwindcss(), react()],
});
