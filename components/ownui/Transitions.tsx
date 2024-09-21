import {
  Table,
  TableBody,
  TableCaption,
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
    <div className="flex-1 overflow-auto">
      <h2 className="font-bold text-center">Transitions</h2>
      <Table className="select-none">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">State</TableHead>
            {symbols.map((symbol, _) => (
              <TableHead key={_} className="font-bold text-center">
                {symbol}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(automata.transitions.table).map((transition, index) => (
            <TableRow key={index}>
              <TableCell className="text-xl text-center">
                {transition.label}
              </TableCell>
              {symbols.map((symbol, symbolIndex) => {
                if (transition.transitions.has(symbol)) {
                  return (
                    <TableCell
                      key={symbolIndex}
                      className="text-xl text-center"
                    >
                      {transition.transitions.get(symbol)}
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell
                      key={symbolIndex}
                      className="text-xl text-center"
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
