import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Asterisk, MoveRight } from "lucide-react";

interface TransitionsTableProps {
  automata: object;
}

export default function TransitionsTable({ automata }: TransitionsTableProps) {
  let symbols;
  // If the automaton is a DFA
  if (automata.NFA) {
    symbols = automata.NFA.regexp.symbols;
    //
    // If it is a NFA
  } else {
    symbols = automata.regexp.symbols.concat(automata.empty_symbol);
  }

  console.log(automata.transitions.table);

  return (
    <div className="flex-none">
      <h2 className="font-bold text-center text-xl">Transitions</h2>
      <Table className="select-none">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center text-lg">
              State
            </TableHead>
            {symbols.map((symbol, _) => (
              <TableHead key={_} className="font-bold text-center text-lg">
                {symbol}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(automata.transitions.table).map((transition, index) => (
            <TableRow key={index}>
              <TableCell className="text-md text-center">
                <span className="relative">
                  <span className="absolute -left-14 flex">
                    {transition.label == automata.initial_state.label && (
                      <MoveRight className="h-4 w-4" />
                    )}
                    {automata.accept_states.some(
                      (state) => state.label == transition.label,
                    ) && <Asterisk className="h-4 w-4" />}
                  </span>

                  {transition.label}
                </span>
              </TableCell>
              {symbols.map((symbol, symbolIndex) => {
                if (transition.transitions.has(symbol)) {
                  return (
                    <TableCell
                      key={symbolIndex}
                      className="text-md text-center"
                    >
                      {Array.isArray(transition.transitions.get(symbol))
                        ? transition.transitions.get(symbol).length > 1
                          ? "{" +
                            transition.transitions.get(symbol).join(", ") +
                            "}"
                          : transition.transitions.get(symbol)
                        : transition.transitions.get(symbol)}
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell
                      key={symbolIndex}
                      className="text-md text-center"
                    >
                      -
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
