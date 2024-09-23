import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StatesTableProps {
  automata: object;
}

export function StatesTableuDFA({ automata }: StatesTableProps) {
  // If the automaton is NOT a DFA
  if (!automata.NFA) return <></>;

  // If the automaton is NOT a uDFA
  if (automata.uDFA) return <></>;

  return (
    <div className="flex-none">
      <h2 className="font-bold text-center text-xl">States</h2>
      <Table className="select-none">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center text-lg">
              State
            </TableHead>
            <TableHead className="font-bold text-center text-lg">
              NFA equivalent states
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(automata.states.table).map((state, index) => (
            <TableRow key={index}>
              <TableCell className="text-md text-center">
                {state.label}
              </TableCell>
              <TableCell className="text-md text-center">
                {"{"}
                {state.states.map((state) => state.label).join(", ")}
                {"}"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatesTablemDFA({ automata }: StatesTableProps) {
  // If the automaton is NOT a mDFA
  if (!automata.uDFA) return <></>;

  return (
    <div className="flex-none">
      <h2 className="font-bold text-center text-xl">States</h2>
      <Table className="select-none">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center text-lg">
              State
            </TableHead>
            <TableHead className="font-bold text-center text-lg">
              NFA significant states
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(automata.equivalent_states.table).map((state, index) => (
            <TableRow key={index}>
              <TableCell className="text-md text-center">
                Significants({state.label})
              </TableCell>
              <TableCell className="text-md text-center">
                {"{"}
                {state.states.map((state) => state.label).join(", ")}
                {"}"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <ul className="list-disc pl-10 space-y-2 mt-5">
          {Array.from(automata.identifiables.table.entries()).map(
            ([label, identicals]: unknown) => (
              <li key={label} className="text-md">
                <span className="font-bold">{label}</span> is identical to{" "}
                {Array.from(identicals).map((identical, index, array) => (
                  <>
                    <span key={index} className="font-bold">
                      {identical}
                    </span>
                    {index < array.length - 2 && ", "}
                    {index === array.length - 2 && " and "}
                  </>
                ))}
                .
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
