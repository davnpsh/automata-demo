import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
                {transition.label}
              </TableCell>
              {symbols.map((symbol, symbolIndex) => {
                if (transition.transitions.has(symbol)) {
                  return (
                    <TableCell
                      key={symbolIndex}
                      className="text-md text-center"
                    >
                      {transition.transitions.get(symbol)}
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
