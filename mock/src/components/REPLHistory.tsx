import "../styles/main.css";

/**
 * Properties of the REPLHistory React component
 * @property history: command output history in the form of a 2D array of JSX elements
 */
interface REPLHistoryProps {
  history: JSX.Element[];
}

/**
 * This function creates the REPLHistory component (a scrollable history of command outputs) based on the given properties.
 * @param props properties for the REPLHistory React component
 * @returns REPLHistory component
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="REPL History">
      {/* Iteratively displays the output elements */}
      {props.history.map((output, outputNumber) => (
        <p>{output}</p>
      ))}
    </div>
  );
}
