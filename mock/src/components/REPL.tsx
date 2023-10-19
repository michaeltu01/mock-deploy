import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

/* 
  You'll want to expand this component (and others) for the sprints! Remember 
  that you can pass "props" as function arguments. If you need to handle state 
  at a higher level, just move up the hooks and pass the state/setter as a prop.
  
  This is a great top level component for the REPL. It's a good idea to have organize all components in a component folder.
  You don't need to do that for this gearup.
*/

/**
 * This function creates the REPL component (the segment that is updated based on user input).
 * @returns REPL component
 */
export default function REPL() {
  // Shared state variables (React hooks)
  // Houses the output history of the REPL component; defaults to an empty array
  const [replHistory, setReplHistory] = useState<JSX.Element[]>([]);
  // Boolean value representing the output mode; brief = true; verbose = false; defaults to brief
  const [mode, setMode] = useState<boolean>(true);
  // 2D array containing the data of the loaded CSV file; defaults to an empty array
  const [csvData, setCsvData] = useState<any[][]>([]);

  return (
    <div className="repl">
      {/*This is where your REPLHistory might go... You also may choose to add it within your REPLInput 
      component or somewhere else depending on your component organization. What are the pros and cons of each? */}
      <REPLHistory history={replHistory} />
      <hr></hr>
      <REPLInput
        outputHistory={replHistory}
        setOutputHistory={setReplHistory}
        mode={mode}
        setMode={setMode}
        data={csvData}
        setData={setCsvData}
      />
    </div>
  );
}
