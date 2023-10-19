import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { REPLHistory } from "./REPLHistory";
import {
  loadError,
  loadSuccess,
  searchApple,
  searchBrown,
  searchDatasourceError,
  searchEmpty,
  searchBadRequestError,
  searchMultiWords,
  test,
  words,
} from "../mockedJson";

/**
 * Properties of the REPLInput React component
 * @property outputHistory: history of command outputs to display in REPLHistory component
 * @property setOutputHistory: setter for outputHistory
 * @property mode: boolean value representing the display mode — true = brief; false = verbose
 * @property setMode: setter for mode
 * @property data: 2D array containing the data of the loaded file; defaults to []
 * @property setData: setter for data
 */
interface REPLInputProps {
  outputHistory: JSX.Element[];
  setOutputHistory: Dispatch<SetStateAction<JSX.Element[]>>;
  mode: boolean; // true is brief, false is verbose
  setMode: Dispatch<SetStateAction<boolean>>;
  data: any[][];
  setData: Dispatch<SetStateAction<any[][]>>;
}

/**
 * This function converts a 2D array into an JSX element containing an HTML table
 * @param arr 2D array to convert to HTML table
 * @returns HTML table containing the elements of the given 2D array
 */
export function toHTMLTable(arr: any[][]): JSX.Element {
  return arr.length != 0 ? (
    <table className="center">
      {arr.map((row) => (
        <tr>
          {row.map((val) => (
            <td>{val}</td>
          ))}
        </tr>
      ))}
    </table>
  ) : (
    <p>No results found</p>
  );
}

/**
 * This function creates the REPLInput component (a text box where users can input commands) based on the given properties.
 * @param props properties for the REPLInput component
 * @returns REPLInput component as JSX
 */
export function REPLInput(props: REPLInputProps) {
  // React hooks (useState variables)
  const [commandString, setCommandString] = useState<string>(""); // Manages the contents of the input box
  const [displayMode, setDisplayMode] = useState<string>("brief"); // Keeps track of the display mode to show up in the button text

  // Mock data maps

  // Map that sends (pretend) filenames to mocked data sets
  const mockedDataSetsMap: { [key: string]: any[][] } = {
    "test.csv": test,
    "words.csv": words,
  };
  // Stores mocked JSON responses for load functionality
  const mockedJsonResponsesMapLoad: { [key: string]: {} } = {
    load_success: { type: "success", details: "file loaded successfully" },
    load_error: { type: "error", error_type: "error_datasource" },
  };
  // Stores mocked JSON responses for view functionality
  const mockedJsonResponsesMapView: { [key: string]: {} } = {
    view_success: { type: "success", details: "file viewed successfully" },
    view_error: { type: "error", error_type: "error_no_file_loaded" },
  };
  // Stores mocked search output for search functionality
  const mockedSearchOutput: { [key: string]: any } = {
    searchIndex: searchBrown,
    searchColumn: searchApple,
    searchRI: searchMultiWords,
    searchMedianIncome: searchMultiWords,
    searchBadRequest: searchBadRequestError,
    searchDataError: searchDatasourceError,
    searchEmptyResults: searchEmpty,
  };

  /**
   * This function handles functionality after the user submits a command to the command line. It parses the command and handles each
   * command (defined by the command word, aka the first word) separately.
   * @param command command given by user input
   * @returns nothing
   */
  function handleSubmit(command: string) {
    // Parse the command into an array of strings
    const spacesNotEnclosedInQuotes: RegExp = /\s(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
    const removeDoubleQuotes: (str: string) => string = (str: string) =>
      str.replace(/"/g, "");
    const commandArray: string[] = commandString
      .split(spacesNotEnclosedInQuotes)
      .map(removeDoubleQuotes);

    // Handle commands based on the command word (commandArray[0])

    // User story 1: "mode" handling
    if (commandArray[0] === "mode") {
      if (commandArray[1] === "brief") {
        props.setMode(true);
        setDisplayMode("brief");
        props.setOutputHistory([
          ...props.outputHistory,
          <p>output mode: brief</p>,
        ]);
      } else if (commandArray[1] === "verbose") {
        props.setMode(false);
        setDisplayMode("verbose");
        const commandOutput: string = "output mode: verbose";
        props.setOutputHistory([
          ...props.outputHistory,
          <p>
            {" "}
            Command: {commandString} <br /> Output: {commandOutput}{" "}
          </p>,
        ]);
      } else {
        if (props.mode) {
          props.setOutputHistory([
            ...props.outputHistory,
            <p>Invalid mode</p>
          ])
        } else {
          const commandOutput: string = "Invalid mode";
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        }
      }
    }
    // User story 2: "load_file" handling
    else if (commandArray[0] === "load_file") {
      if (props.mode) {
        // brief
        if (mockedDataSetsMap[commandArray[1]] != undefined) {
          props.setData(mockedDataSetsMap[commandArray[1]]);
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              {JSON.stringify(mockedJsonResponsesMapLoad["load_success"])}{" "}
            </p>,
          ]);
        } else {
          props.setOutputHistory([
            ...props.outputHistory,
            <p> {JSON.stringify(mockedJsonResponsesMapLoad["load_error"])} </p>,
          ]);
        }
      } else {
        // verbose
        if (mockedDataSetsMap[commandArray[1]] != undefined) {
          props.setData(mockedDataSetsMap[commandArray[1]]);
          const commandOutput = JSON.stringify(
            mockedJsonResponsesMapLoad["load_success"]
          );
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        } else {
          const commandOutput = JSON.stringify(
            mockedJsonResponsesMapLoad["load_error"]
          );
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        }
      }
    }
    // User story 4: "search" handling
    else if (commandArray[0] === "search") {
      if (props.mode) {
        // brief
        if (props.data.length === 0) {
          props.setOutputHistory([
            ...props.outputHistory,
            <p>{JSON.stringify(mockedSearchOutput["searchDataError"])}</p>,
          ]);
          setCommandString("");
          return;
        }
        if (commandArray.length < 2 || commandArray.length > 3) {
          props.setOutputHistory([
            ...props.outputHistory,
            <p>{JSON.stringify(mockedSearchOutput["searchBadRequest"])}</p>,
          ]);
          setCommandString("");
          return;
        }
        if (commandArray.length === 2) {
          // search entire CSV
          if (commandString === "search oranges") {
            props.setOutputHistory([
              ...props.outputHistory,
              toHTMLTable(mockedSearchOutput["searchEmptyResults"]),
            ]);
            setCommandString("");
            return;
          }
          if (commandString === 'search "Rhode Island"') {
            props.setOutputHistory([
              ...props.outputHistory,
              toHTMLTable(mockedSearchOutput["searchRI"]),
            ]);
            setCommandString("");
            return;
          }
          props.setOutputHistory([
            ...props.outputHistory,
            toHTMLTable(mockedSearchOutput["searchColumn"]),
          ]);
        } else if (
          !isNaN(parseInt(commandArray[1])) &&
          parseFloat(commandArray[1]) === parseInt(commandArray[1])
        ) {
          // searching by column index
          props.setOutputHistory([
            ...props.outputHistory,
            toHTMLTable(mockedSearchOutput["searchIndex"]),
          ]);
        } else if (isNaN(parseInt(commandArray[1]))) {
          // searching by column name
          if (
            commandString === 'search "Median Household Income" "Rhode Island"'
          ) {
            props.setOutputHistory([
              ...props.outputHistory,
              toHTMLTable(mockedSearchOutput["searchMedianIncome"]),
            ]);
            setCommandString("");
            return;
          }
          props.setOutputHistory([
            ...props.outputHistory,
            toHTMLTable(mockedSearchOutput["searchColumn"]),
          ]);
        } else {
          // expect Bad Request Error
          props.setOutputHistory([
            ...props.outputHistory,
            <p>{JSON.stringify(mockedSearchOutput["searchBadRequest"])}</p>,
          ]);
        }
      } else {
        // verbose
        if (props.data.length === 0) {
          props.setOutputHistory([
            ...props.outputHistory,
            <p>{JSON.stringify(mockedSearchOutput["searchDataError"])}</p>,
          ]);
          setCommandString("");
          return;
        }
        if (commandArray.length < 2 || commandArray.length > 3) {
          const commandOutput = JSON.stringify(
            mockedSearchOutput["searchBadRequest"]
          );
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
          setCommandString("");
          return;
        }
        if (commandArray.length === 2) {
          // search the entire CSV
          if (commandString === "search oranges") {
            const commandOutput = toHTMLTable(
              mockedSearchOutput["searchEmptyResults"]
            );
            props.setOutputHistory([
              ...props.outputHistory,
              <p>
                {" "}
                Command: {commandString} <br /> Output: {commandOutput}{" "}
              </p>,
            ]);
            setCommandString("");
            return;
          }
          if (commandString === 'search "Rhode Island"') {
            const commandOutput = toHTMLTable(mockedSearchOutput["searchRI"]);
            props.setOutputHistory([
              ...props.outputHistory,
              <p>
                {" "}
                Command: {commandString} <br /> Output: {commandOutput}{" "}
              </p>,
            ]);
            setCommandString("");
            return;
          }
          const commandOutput = toHTMLTable(mockedSearchOutput["searchColumn"]);
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        } else if (
          !isNaN(parseInt(commandArray[1])) &&
          parseFloat(commandArray[1]) === parseInt(commandArray[1])
        ) {
          // searching by column index
          const commandOutput = toHTMLTable(mockedSearchOutput["searchIndex"]);
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        } else if (isNaN(parseInt(commandArray[1]))) {
          // searching by column name
          if (
            commandString === 'search "Median Household Income" "Rhode Island"'
          ) {
            const commandOutput = toHTMLTable(
              mockedSearchOutput["searchMedianIncome"]
            );
            props.setOutputHistory([
              ...props.outputHistory,
              <p>
                {" "}
                Command: {commandString} <br /> Output: {commandOutput}{" "}
              </p>,
            ]);
            setCommandString("");
            return;
          }
          const commandOutput = toHTMLTable(mockedSearchOutput["searchColumn"]);
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        } else {
          // expect Bad Request Error
          const commandOutput = JSON.stringify(
            mockedSearchOutput["searchBadRequest"]
          );
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        }
      }
    }
    // User story 3: "view" handling
    else if (commandArray[0] === "view") {
      if (props.mode) {
        if (props.data.length == 0) {
          props.setOutputHistory([
            ...props.outputHistory,
            <p> {JSON.stringify(mockedJsonResponsesMapView["view_error"])} </p>,
          ]);
        } else {
          props.setOutputHistory([
            ...props.outputHistory,
            toHTMLTable(props.data),
          ]);
        }
      } else {
        if (props.data.length == 0) {
          const commandOutput = JSON.stringify(
            mockedJsonResponsesMapView["view_error"]
          );
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput}{" "}
            </p>,
          ]);
        } else {
          const commandOutput = JSON.stringify(
            mockedJsonResponsesMapView["view_success"]
          );
          props.setOutputHistory([
            ...props.outputHistory,
            <p>
              {" "}
              Command: {commandString} <br /> Output: {commandOutput} <br />
              {toHTMLTable(props.data)}
            </p>,
          ]);
        }
      }
    }
    // Invalid command handling
    else {
      if (props.mode) {
        props.setOutputHistory([
          ...props.outputHistory,
          <p>Invalid command</p>,
        ]);
      } else {
        props.setOutputHistory([
          ...props.outputHistory,
          <p>
            Command: {commandString} <br /> Output: Invalid command: "
            {commandString}"
          </p>,
        ]);
      }
    }
    setCommandString(""); // reset the command string
  }

  return (
    <div className="repl-input">
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
          // Enables ENTER to submit command in this component
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              // Prevent the default behavior of the Enter key
              event.preventDefault();

              // Perform the action when the Enter key is pressed
              handleSubmit(commandString);
            }
          }}
        />
      </fieldset>
      {/* Button functionality defined in handleSubmit */}
      <button onClick={() => handleSubmit(commandString)}>
        Submit <br /> (currently in {displayMode} mode)
      </button>
    </div>
  );
}
