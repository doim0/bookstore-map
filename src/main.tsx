import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA (safe: only when supported)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Unregister all existing service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }

      // Register new service worker with base path for GitHub Pages
      const registration = await navigator.serviceWorker.register(
        "/bookstore-map/sw.js"
      );
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    } catch (err) {
      console.warn("ServiceWorker registration failed: ", err);
    }
  });
}
