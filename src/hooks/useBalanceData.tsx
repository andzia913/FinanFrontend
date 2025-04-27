import { useState, useEffect } from "react";
import serverAddress from "../utils/server.ts";
import fetchOptionsGETWithToken from "../utils/fetchOptionsGETWithToken.tsx";

export const useBalanceData = () => {
  const [balanceData, setBalanceData] = useState<any | null>(null);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [balanceCostSum, setBalanceCostSum] = useState(0);
  const [balanceIncomeSum, setBalanceIncomeSum] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchBalanceData = async () => {
    try {
      const res = await fetch(serverAddress + "/financialBalance", fetchOptionsGETWithToken);
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Błąd podczas pobierania danych");
      }

      const { balanceCostSum, balanceIncomeSum, financialBalance } = data;

      setBalanceData(financialBalance);

      // Obliczanie sum
      setBalanceCostSum(balanceCostSum || 0);
      setBalanceIncomeSum(balanceIncomeSum || 0);

      const total = balanceIncomeSum - balanceCostSum;
      setBalanceTotal(total);

    } catch (err: any) {
      setError(err.message || "Wystąpił błąd przy pobieraniu danych.");
      console.error(err);
    }
  };

  useEffect(() => {

    fetchBalanceData();
  }, []);
  return { balanceData, balanceCostSum, balanceIncomeSum, balanceTotal, error };
};
