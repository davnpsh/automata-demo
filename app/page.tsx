"use client";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Check, X } from "lucide-react";
import { VscGithubAlt } from "react-icons/vsc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Symbols from "@/components/ownui/Symbols";
import TransitionsTable from "@/components/ownui/Transitions";

import { useState, useRef, useEffect } from "react";

import Cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import {
  mDFA,
  uDFA,
  NFA,
  cytoscape_styles,
  cytoscape_layout,
} from "@davnpsh/automata";
import { runSimulation } from "@/lib/utils";

Cytoscape.use(dagre);

export default function Home() {
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regex, setRegex] = useState("");
  const [selectValue, setSelectValue] = useState("nfa");
  const [automata, setAutomata] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [testString, setTestString] = useState("");
  const [stringAccepted, setStringAccepted] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Handle
  useEffect(() => {
    if (stringAccepted === null && cyRef.current) {
      cyRef.current.elements().removeStyle();
    }
  }, [stringAccepted]);

  // Handle automaton generaton on Select change
  useEffect(() => {
    if (!regex) return;
    handleRegex();
  }, [selectValue]);

  const handleRegex = () => {
    setStringAccepted(null);
    setIsLoading(true);
    // API call
    setTimeout(() => {
      try {
        switch (selectValue) {
          case "nfa":
            setAutomata(new NFA(regex));
            break;
          case "udfa":
            setAutomata(new uDFA(regex));
            break;
          case "mdfa":
            setAutomata(new mDFA(regex));
            break;
        }
      } catch (e: Error) {
        setAutomata(null);
        toast({
          variant: "destructive",
          title: "Error on user input:",
          description: e.message,
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Just to show loading animation
  };

  const handleTest = () => {
    if (!automata) return;
    setStringAccepted(null);

    const result = automata.test(testString);

    // Start animation process
    setAnimating(true);
    // Timeout to fix weird bug
    setTimeout(() => {
      runSimulation(cyRef, result).then(() => {
        setAnimating(false);
        setStringAccepted(result.accept);
      });
    }, 100);
  };

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
            disabled={isLoading || animating}
          />
          <Button
            size="icon"
            onClick={handleRegex}
            disabled={isLoading || animating || !regex.trim()}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4 overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-auto">
          {/* Symbols */}
          {automata ? <Symbols automata={automata} /> : <></>}
          {/* States table */}
          {automata ? <TransitionsTable automata={automata} /> : <></>}
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
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : automata ? (
              <CytoscapeComponent
                elements={automata.cytograph()}
                style={{ width: "100%", height: "100%" }}
                stylesheet={cytoscape_styles}
                layout={cytoscape_layout}
                cy={(cy: Cytoscape.Core) => {
                  cyRef.current = cy;
                }}
                boxSelectionEnabled={false}
                minZoom={2}
                maxZoom={4}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 select-none">
                Enter a regular expression on the top
              </div>
            )}
          </div>

          {/* Testing area */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter a string to test with the automaton..."
                value={testString}
                onChange={(e) => {
                  setTestString(e.target.value);
                  setStringAccepted(null);
                }}
                disabled={isLoading || animating}
                className={
                  stringAccepted === true
                    ? "border-green-500 border-4"
                    : stringAccepted === false
                      ? "border-red-500 border-4"
                      : ""
                }
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {stringAccepted === true ? (
                  <Check className="text-green-500" />
                ) : stringAccepted === false ? (
                  <X className="text-red-500" />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={handleTest}
              disabled={isLoading || animating}
            >
              Test
            </Button>
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
