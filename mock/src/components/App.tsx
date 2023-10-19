import "../styles/App.css";
import REPL from "./REPL";

/**
 * This function creates the App component (the application front-end). This is the highest level component!
 */
function App() {
  return (
    <div className="App">
      <p className="App-header">
        <h1>Mock</h1>
      </p>
      <REPL />
    </div>
  );
}

export default App;
