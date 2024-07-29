// hooks/useEnvironment.ts
import { useEffect, useState } from "react";
import { API_URL } from "@env";

interface Environment {
  API_URL: string;
}

export const useEnvironment = (): Environment => {
  const [environment, setEnvironment] = useState<Environment>({
    API_URL: "",
  });

  useEffect(() => {
    setEnvironment({
      API_URL: API_URL,
    });
  }, []);

  return environment;
};
