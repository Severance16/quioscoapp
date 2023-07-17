import { useContext } from "react";
import QuioscoCostext from "@/context/QuioscoProvider";

export default function useQuiosco() {
  return useContext(QuioscoCostext)
}
