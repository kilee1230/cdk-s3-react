import { atom } from "jotai";

// Theme Atom
export const themeAtom = atom<"light" | "dark">("light");
themeAtom.debugLabel = "themeAtom";
