import "../styles/main.css";
import { Dispatch, SetStateAction } from "react";

/**
 * Properties of the ControlledInput component
 * @property value: user-input command
 * @property setValue: setter for value
 * @property ariaLabel: label for accessibility readers
 * @property onKeyDown: function that handles keyboard input
 */
interface ControlledInputProps {
  value: string;
  //   Concretely, this means "a function that sets a state containing a string"
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

// Input boxes contain state. We want to make sure React is managing that state,
//   so we have a special component that wraps the input box.
/**
 * This function creates the ControlledInput component (an input box that wraps the REPLInput to utilize React to manage state).
 * @param props properties for the ControlledInput component
 * @returns ControlledInput component
 */
export function ControlledInput(props: ControlledInputProps) {
  return (
    <input
      type="text"
      className="repl-command-box"
      value={props.value}
      placeholder="Type command here and press Submit or hit Enter!"
      onChange={(ev) => props.setValue(ev.target.value)}
      aria-label={props.ariaLabel}
      onKeyDown={props.onKeyDown}
    ></input>
  );
}
