import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { ChatInterface } from "./components/ChatInterface";
import { ChatHistory } from "./components/ChatHistory";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/chat", Component: ChatInterface },
  { path: "/history", Component: ChatHistory },
]);
