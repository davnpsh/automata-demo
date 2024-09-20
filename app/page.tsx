"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { VscGithubAlt } from "react-icons/vsc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";

export default function Home() {
  const [regex, setRegex] = useState("");
  const [selectValue, setSelectValue] = useState("nfa");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top input */}
      <div className="p-4 bg-secondary">
        <div className="flex gap-2 max-w-md mx-auto w-full">
          <Input
            placeholder="Enter regular expression..."
            className="flex-1"
            value={regex}
            onChange={(e) => {
              setRegex(e.target.value);
            }}
            disabled={isLoading}
          />
          <Button size="icon" disabled={isLoading || !regex.trim()}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4 overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-auto">
          {/* Symbols */}
          <div className="flex-1 overflow-auto">
            <h2 className="font-bold text-center">Symbols</h2>
            <p className="text-xl text-center">
              &Sigma; = {"{"}
              {"}"}
            </p>
          </div>
          {/* States table */}
          <div className="flex-1 overflow-auto">
            <h2 className="font-bold text-center">States</h2>
            <Table>
              <TableHeader>
                <TableRow></TableRow>
              </TableHeader>
              <TableBody>
                <TableRow></TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-2/3 flex flex-col mt-4 lg:mt-0">
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select an option"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nfa">
                Nondeterministic Finite Automaton (NFA)
              </SelectItem>
              <SelectItem value="udfa">
                Unoptimized Deterministic Finite Automaton (uDFA)
              </SelectItem>
              <SelectItem value="mdfa">
                Minimised Deterministic Finite Automaton (mDFA)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Graph */}
          <div className="flex-1 bg-secondary rounded-lg mb-4 p-4 overflow-auto min-h-[200px] lg:min-h-0">
            {isLoading ? <></> : <></>}
          </div>

          {/* Testing area */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              className="flex-1"
              placeholder="Enter a string to test with the automaton..."
            />
            <Button className="w-full sm:w-auto">Test</Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary p-4 mt-auto">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            :3
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/davnpsh/automata"
              target="_blank"
              className="text-muted-foreground hover:text-primary"
            >
              <VscGithubAlt className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@davnpsh/automata"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              npm
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
