import { useEffect } from "react";
import "./App.css";
import Number from "./numbers/Number";

function App() {
  useEffect(() => {
    fetch("http://localhost:4000/requestCookie", {
      method: "POST",
      credentials: "include",
    });
  }, []);
  return (
    <div className="App">
      {process.env.REACT_APP_SUBS === "ws" ? "Websocket" : "SSE"}
      <Number />
    </div>
  );
}

export default App;
