import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import ServicePage, { isServiceRoute } from "./app/ServicePage.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(isServiceRoute() ? <ServicePage /> : <App />);
