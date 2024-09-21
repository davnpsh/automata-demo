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

  return (
    <div className="flex-1 overflow-auto">
      <h2 className="font-bold text-center">Symbols</h2>
      <p className="text-xl text-center">
        &Sigma; = {"{"}
        {symbols.join(", ")}
        {"}"}
      </p>
    </div>
  );
}
