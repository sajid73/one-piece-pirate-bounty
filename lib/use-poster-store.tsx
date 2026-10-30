"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import { PosterConfig, DEFAULT_CONFIG } from "./poster-config";

interface State {
  config: PosterConfig;
  past: PosterConfig[];
  future: PosterConfig[];
}

type Action =
  | { type: "SET"; payload: Partial<PosterConfig> }
  | { type: "SET_PHOTO"; payload: Partial<PosterConfig["photo"]> }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" }
  | { type: "LOAD"; payload: PosterConfig };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "SET":
      return {
        config: { ...s.config, ...a.payload },
        past: [...s.past.slice(-49), s.config],
        future: [],
      };
    case "SET_PHOTO":
      return {
        config: { ...s.config, photo: { ...s.config.photo, ...a.payload } },
        past: [...s.past.slice(-49), s.config],
        future: [],
      };
    case "UNDO": {
      if (!s.past.length) return s;
      return {
        config: s.past[s.past.length - 1],
        past: s.past.slice(0, -1),
        future: [s.config, ...s.future],
      };
    }
    case "REDO": {
      if (!s.future.length) return s;
      return {
        config: s.future[0],
        past: [...s.past, s.config],
        future: s.future.slice(1),
      };
    }
    case "RESET":
      return {
        config: { ...DEFAULT_CONFIG },
        past: [...s.past.slice(-49), s.config],
        future: [],
      };
    case "LOAD":
      return { config: a.payload, past: [], future: [] };
    default:
      return s;
  }
}

const Ctx = createContext<{
  config: PosterConfig;
  update: (p: Partial<PosterConfig>) => void;
  updatePhoto: (p: Partial<PosterConfig["photo"]>) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  save: () => void;
  load: () => boolean;
} | null>(null);

export function PosterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    config: { ...DEFAULT_CONFIG },
    past: [],
    future: [],
  });

  const update = useCallback(
    (p: Partial<PosterConfig>) => dispatch({ type: "SET", payload: p }),
    [],
  );
  const updatePhoto = useCallback(
    (p: Partial<PosterConfig["photo"]>) =>
      dispatch({ type: "SET_PHOTO", payload: p }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const save = useCallback(() => {
    try {
      localStorage.setItem(
        "pirate-bounty-config",
        JSON.stringify(state.config),
      );
    } catch {
      try {
        const lite = {
          ...state.config,
          photo: { ...state.config.photo, dataUrl: null },
        };
        localStorage.setItem("pirate-bounty-config", JSON.stringify(lite));
      } catch {
        /* storage full */
      }
    }
  }, [state.config]);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem("pirate-bounty-config");
      if (raw) {
        dispatch({ type: "LOAD", payload: { ...DEFAULT_CONFIG, ...JSON.parse(raw) } });
        return true;
      }
    } catch {
      /* corrupt data */
    }
    return false;
  }, []);

  return (
    <Ctx.Provider
      value={{
        config: state.config,
        update,
        updatePhoto,
        undo,
        redo,
        reset,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
        save,
        load,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePosterStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePosterStore requires PosterProvider");
  return ctx;
}
