import { useEffect } from "react";

interface SymbolsProps {
  automata: object;
}

export default function Symbols({ automata }: SymbolsProps) {
  let symbols;
  // If the automaton is a DFA
  if (automata.NFA) {
    symbols = automata.NFA.regexp.symbols;
    //
    // If it is a NFA
  } else {
    symbols = automata.regexp.symbols;
  }

  symbols.sort((a: number | string, b: number | string) => {
    // Convert both elements to strings for comparison
    const strA = String(a);
    const strB = String(b);

    // Compare the two strings
    if (strA < strB) {
      return -1; // a comes before b
    }
    if (strA > strB) {
      return 1; // a comes after b
    }
    return 0; // a and b are equal
  });

  return (
    <div className="flex-none">
      <h2 className="font-bold text-center text-xl">Symbols</h2>
      <p className="text-md text-center">
        &Sigma; = {"{"}
        {symbols.join(", ")}
        {"}"}
      </p>
    </div>
  );
}
