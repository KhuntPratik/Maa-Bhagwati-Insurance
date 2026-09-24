import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const parseCsvLine = (line) => {
  const cells = [];
  let currentCell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"' && line[index + 1] === '"') {
      currentCell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(currentCell.trim());
      currentCell = "";
    } else {
      currentCell += character;
    }
  }

  cells.push(currentCell.trim());
  return cells;
};

const toKey = (header) =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const InsuranceContext = createContext(null);
export const allProductsContext = InsuranceContext;

export const InsuranceProvider = ({ children }) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const csvURL = import.meta.env.VITE_CSV_URL;

  const fetchPolicies = useCallback(async () => {
    if (!csvURL) {
      setPolicies([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(csvURL);
      const text = await response.text();

      const lines = text
        .split(/\r?\n/)
        .filter((line) => line.trim());

      if (lines.length < 2) {
        setPolicies([]);
        return;
      }

      const headers = parseCsvLine(lines[0]).map((header) => header.trim());
      const headerKeys = headers.map(toKey);

      const parsed = lines.slice(1)
        .map((line, index) => {
          const cells = parseCsvLine(line).map((cell) => cell.trim());

          return {
            sheetRow: index + 2,
            data: cells,
            headers,
            headerKeys,
          };
        })
        .filter((item) => item.data.length >= 1);

      setPolicies(parsed);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [csvURL]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const value = useMemo(
    () => ({
      policies,
      setPolicies,
      loading,
      fetchPolicies,
    }),
    [policies, loading, fetchPolicies]
  );

  return (
    <InsuranceContext.Provider value={value}>
      {children}
    </InsuranceContext.Provider>
  );
};

export const useInsuranceContext = () => {
  const context = useContext(InsuranceContext);

  if (!context) {
    throw new Error(
      "useInsuranceContext must be used within an InsuranceProvider"
    );
  }

  return context;
};

export default InsuranceContext;

