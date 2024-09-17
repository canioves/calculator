import "./App.css";
import { useState } from "react";

function Calculator() {
  const [number, setNumber] = useState("0");
  const [numbers, setNumbers] = useState([]);

  const [operator, setOperator] = useState("");
  const [operators, setOperators] = useState([]);

  const [isNegative, setIsNegative] = useState(false);

  let allNumbers = [];
  let allOperators = [];

  const [displayFormula, setDisplayFormula] = useState("0");
  function handleDigitButton(value) {
    setOperator("");
    setIsNegative(false);

    let newNumber = number;

    if (number === "0" && value === "0") {
      newNumber = "0";
    } else if (number === "0" && value !== "0") {
      newNumber = value;
      setDisplayFormula(value);
    } else {
      newNumber = number + value;
      setDisplayFormula(displayFormula + value);
    }

    setNumber(newNumber);
  }

  function handleClearButton() {
    setNumbers([]);
    setOperators([]);
    setNumber("0");
    setOperator("");
    setDisplayFormula("0");
  }

  function handleOperatorButton(value) {
    let newOperator = value;
    let newOperators = [...operators];

    let newNumbers = [...numbers];

    let newIsNegative = isNegative;

    if (operator !== "") {
      if (newOperator === "-") {
        if (!isNegative) {
          newIsNegative = true;
        } else {
          newIsNegative = false;
          newOperators.pop();
          newOperators.push(newOperator);
        }
      } else {
        newIsNegative = false;
        newOperators.pop();
        newOperators.push(newOperator);
      }
    } else {
      newOperators.push(newOperator);
      newNumbers.push(parseFloat(number));
    }

    setOperator(newOperator);
    setOperators(newOperators);

    setNumbers(newNumbers);
    setNumber(newIsNegative ? "-" : "");

    setIsNegative(newIsNegative);

    setDisplayFormula(displayFormula + newOperator);
  }

  function handleDecimalButton() {
    let newNumber = number;
    if (!newNumber.includes(".")) {
      newNumber += ".";
      setNumber(newNumber);
      setDisplayFormula(displayFormula + ".");
    }
  }

  function handleEqualsButton() {
    allNumbers = [...numbers, parseFloat(number)];
    allOperators = [...operators];

    const formulaResult = calculateFormula();

    setDisplayFormula(formulaResult.toString());

    setNumber(formulaResult.toString());
    setNumbers([]);
    setOperators([]);
    setOperator("");
  }

  function calculateFormula() {
    let tempResult = 0;
    let multIndex = 0;
    let divIndex = 0;

    while (multIndex !== -1 || divIndex !== -1) {
      multIndex = allOperators.indexOf("*");
      divIndex = allOperators.indexOf("/");
      if (multIndex > -1) {
        tempResult = allNumbers[multIndex] * allNumbers[multIndex + 1];
        allNumbers = [
          ...allNumbers.slice(0, multIndex),
          tempResult,
          ...allNumbers.slice(multIndex + 2),
        ];
        allOperators.splice(multIndex, 1);
      } else if (divIndex > -1) {
        tempResult = allNumbers[divIndex] / allNumbers[divIndex + 1];
        allNumbers = [
          ...allNumbers.slice(0, divIndex),
          tempResult,
          ...allNumbers.slice(divIndex + 2),
        ];
        allOperators.splice(divIndex, 1);
      }
    }

    while (allOperators.length > 0) {
      if (allOperators[0] === "+") {
        tempResult = allNumbers[0] + allNumbers[1];
      } else if (allOperators[0] === "-") {
        tempResult = allNumbers[0] - allNumbers[1];
      }

      allNumbers = [tempResult, ...allNumbers.slice(2)];
      allOperators.splice(0, 1);
    }
    const result = allNumbers[0];

    allNumbers = [];
    allOperators = [];
    return result;
  }

  return (
    <>
      <h1>Calculator</h1>
      <div id="calculator-container">
        <Display displayText={displayFormula}></Display>
        <Keyboard
          onDigitButtonClick={handleDigitButton}
          onClearButtonClick={handleClearButton}
          onOperatorButtonClick={handleOperatorButton}
          onEqualsButtonClick={handleEqualsButton}
          onDecimalButtonClick={handleDecimalButton}
        ></Keyboard>
      </div>
    </>
  );
}

function Display({ displayText }) {
  return (
    <div id="display-container">
      <span id="display">{displayText}</span>
    </div>
  );
}

function Keyboard({
  onDigitButtonClick,
  onClearButtonClick,
  onOperatorButtonClick,
  onEqualsButtonClick,
  onDecimalButtonClick,
}) {
  return (
    <div id="keyboard">
      <KeyboardRow>
        <button id="one" onClick={() => onDigitButtonClick("1")}>
          1
        </button>
        <button id="two" onClick={() => onDigitButtonClick("2")}>
          2
        </button>
        <button id="three" onClick={() => onDigitButtonClick("3")}>
          3
        </button>
        <button id="clear" className="wide" onClick={onClearButtonClick}>
          C
        </button>
      </KeyboardRow>
      <KeyboardRow>
        <button id="four" onClick={() => onDigitButtonClick("4")}>
          4
        </button>
        <button id="five" onClick={() => onDigitButtonClick("5")}>
          5
        </button>
        <button id="six" onClick={() => onDigitButtonClick("6")}>
          6
        </button>
        <button id="add" onClick={() => onOperatorButtonClick("+")}>
          +
        </button>
        <button id="subtract" onClick={() => onOperatorButtonClick("-")}>
          -
        </button>
      </KeyboardRow>
      <KeyboardRow>
        <button id="seven" onClick={() => onDigitButtonClick("7")}>
          7
        </button>
        <button id="eight" onClick={() => onDigitButtonClick("8")}>
          8
        </button>
        <button id="nine" onClick={() => onDigitButtonClick("9")}>
          9
        </button>
        <button id="multiply" onClick={() => onOperatorButtonClick("*")}>
          *
        </button>
        <button id="divide" onClick={() => onOperatorButtonClick("/")}>
          /
        </button>
      </KeyboardRow>
      <KeyboardRow>
        <button
          id="zero"
          className="wide"
          onClick={() => onDigitButtonClick("0")}
        >
          0
        </button>
        <button id="decimal" onClick={onDecimalButtonClick}>
          .
        </button>
        <button id="equals" className="wide" onClick={onEqualsButtonClick}>
          =
        </button>
      </KeyboardRow>
    </div>
  );
}

function KeyboardRow({ children }) {
  return <div className="row">{children}</div>;
}

export default Calculator;
