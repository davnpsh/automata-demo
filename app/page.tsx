"use client";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Check, X, Image, Download } from "lucide-react";
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
import { StatesTablemDFA, StatesTableuDFA } from "@/components/ownui/States";

import { useState, useRef, useEffect } from "react";

import html2canvas from "html2canvas";

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
            setAutomata(new NFA(regex, { empty_symbol: "&" }));
            break;
          case "udfa":
            setAutomata(new uDFA(regex, { empty_symbol: "&" }));
            break;
          case "mdfa":
            setAutomata(new mDFA(regex, { empty_symbol: "&" }));
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

    let result;
    try {
      result = automata.test(testString);
    } catch (e: Error) {
      toast({
        variant: "destructive",
        title: "Error on user input:",
        description: e.message,
      });
      return;
    }

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

  const captureAutomaton = () => {
    const automaton = document.getElementById("automaton");

    html2canvas(automaton).then((canvas) => {
      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "automaton.png";
      link.href = image;
      link.click();
    });
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
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-136px)]">
          {/* Symbols */}
          {automata ? <Symbols automata={automata} /> : <></>}
          {/* Transitions table */}
          {automata ? <TransitionsTable automata={automata} /> : <></>}
          {/* States table of uDFA */}
          {automata ? <StatesTableuDFA automata={automata} /> : <></>}
          {/* States table of mDFA */}
          {automata ? <StatesTablemDFA automata={automata} /> : <></>}
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-2/3 flex flex-col mt-4 lg:mt-0">
          <Select value={selectValue} onValueChange={setSelectValue} disabled={isLoading || animating}>
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
          <div className="flex-1 bg-secondary rounded-lg mb-4 p-4 overflow-auto min-h-[500px] lg:min-h-0 relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : automata ? (
              <>
                <Button
                  className="absolute z-10 right-5 top-5"
                  size="icon"
                  onClick={captureAutomaton}
                >
                  <Download className="h-5 w-5" />
                </Button>
                <CytoscapeComponent
                  id="automaton"
                  elements={automata.cytograph()}
                  style={{ width: "100%", height: "100%" }}
                  stylesheet={cytoscape_styles}
                  layout={cytoscape_layout}
                  cy={(cy: Cytoscape.Core) => {
                    cyRef.current = cy;
                  }}
                  boxSelectionEnabled={false}
                  minZoom={1}
                  maxZoom={4}
                  wheelSensitivity={0.1}
                />
                <p className="absolute bottom-5 left-5 text-sm text-gray-500 select-none">
                  In some cases, the edges may overlap. To fix this, just drag
                  and drop the nodes until you see all of the edges.
                </p>
              </>
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
                placeholder="Enter a string to test with the automaton or leave blank to enter an empty string..."
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
            Made by{" "}
            <a
              href="https://github.com/davnpsh"
              className="hover:underline"
              target="_blank"
            >
              davnpsh
            </a>{", "}
            <a
              href="https://github.com/K3nnyZY"
              className="hover:underline"
              target="_blank"
            >
              K3nnyZY
            </a>{", "}
            <a
              href="https://github.com/Rcgil30"
              className="hover:underline"
              target="_blank"
            >
               Rcgil30
            </a>{" and "}
            <a
              href="https://github.com/FiboDev"
              className="hover:underline"
              target="_blank"
            >
              FiboDev
            </a>
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
