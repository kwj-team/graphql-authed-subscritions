import "./App.css";
import Number from "./numbers/Number";

function App() {
  console.log(process.env);
  return (
    <div className="App">
      {process.env.REACT_APP_SUBS === "ws" ? "Websocket" : "SSE"}
      <Number />
    </div>
  );
}

export default App;
