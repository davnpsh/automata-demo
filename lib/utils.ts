import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cytoscape from "cytoscape";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function runSimulation(
  cyRef: Cytoscape.Core,
  result: object,
): Promise<void> {
  return new Promise((resolve) => {
    if (!cyRef.current) {
      resolve();
      return;
    }

    // Run test on the automaton
    const cy = cyRef.current,
      accept = result.accept,
      routes = result.routes;

    const sequences: any[] = [];
    buildSequences();
    highlightSequences();

    /**
     * Builds a list of sequences of states and edges
     */
    function buildSequences(): void {
      // Build a sequence
      for (const route of routes) {
        const sequence: any[] = [];

        for (let i = 0; i < route.transitions.length; i++) {
          const transition = route.transitions[i];
          // Add graph node
          const node = cy.$(`node[id = "${transition.from.label}"]`);
          sequence.push(node);

          // Add graph edge if symbol exists
          if (transition.symbol) {
            // Find the next state in the sequence
            const next_transition = route.transitions[i + 1];

            // Select the edge with matching label that points to the next state
            const edges = node.outgoers(`edge[label = "${transition.symbol}"]`);

            edges.forEach((edge: any) => {
              if (next_transition.from.label == edge.target().id()) {
                sequence.push(edge);
              }
            });
          }
        }

        sequences.push(sequence);
        // Do this until an accept state if it exists
        if (route.valid) return;
      }
    }

    /**
     * Highlights the sequences of states and edges
     */
    function highlightSequences() {
      let delay = 0;
      const highlightDuration = 500; // Duration for each highlight

      // Remove previous styles
      cy.elements().removeStyle();

      sequences.forEach((sequence: any[], seqIndex: any) => {
        sequence.forEach((element, elemIndex) => {
          setTimeout(() => {
            // If it's the last element of the last sequence and accept is true
            if (
              seqIndex === sequences.length - 1 &&
              elemIndex === sequence.length - 1 &&
              accept
            ) {
              element.animate(
                {
                  style: {
                    "background-color": "#90EE90",
                    "line-color": "#90EE90",
                    "target-arrow-color": "#90EE90",
                  },
                },
                {
                  duration: 0,
                },
              );
              //
              // Highlight current element
            } else {
              element.animate(
                {
                  style: {
                    "background-color": "orange",
                    "line-color": "orange",
                    "target-arrow-color": "orange",
                  },
                },
                {
                  duration: 100,
                },
              );

              setTimeout(() => {
                element.removeStyle();
              }, highlightDuration);
            }

            // If it's the last element of the last sequence
            // Resolve the promise when all animations are complete
            if (
              seqIndex === sequences.length - 1 &&
              elemIndex === sequence.length - 1
            ) {
              resolve();
            }
          }, delay);

          delay += highlightDuration;
        });
      });
    }
  });
}
