import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Register service worker with correct path for GitHub Pages
      const registration = await navigator.serviceWorker.register(
        "/bookstore-map/sw.js",
        { scope: "/bookstore-map/" }
      );

      console.log("ServiceWorker registered successfully:", registration.scope);

      // Update on reload
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log(
                "New service worker available, will update on next visit"
              );
            }
          });
        }
      });
    } catch (err) {
      console.warn("ServiceWorker registration failed:", err);
    }
  });
}
