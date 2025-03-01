import { useState, useEffect } from "react";

export function useThemeSetup() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { mounted };
}
