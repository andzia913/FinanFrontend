import { useState, useEffect } from "react";
import serverAddress from "../utils/server.ts";
import fetchOptionsGETWithToken from "../utils/fetchOptionsGETWithToken.tsx";

export const useBalanceData = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [balanceCostSum, setBalanceCostSum] = useState(0);
  const [balanceIncomeSum, setBalanceIncomeSum] = useState(0);

  useEffect(() => {
    const fetchBalanceData = async () => {
      const res = await fetch(
        serverAddress + "/financialBalance",
        fetchOptionsGETWithToken
      );
      const balanceData = await res.json();

      if (balanceData.balanceCostSum) {
        const total = balanceData.balanceIncomeSum - balanceData.balanceCostSum;
        setBalanceTotal(total);
      } else {
        setBalanceTotal(0);
      }
      setBalanceCostSum(
        balanceData.balanceCostSum ? balanceData.balanceCostSum : 0
      );
      setBalanceIncomeSum(
        balanceData.balanceIncomeSum ? balanceData.balanceIncomeSum : 0
      );
      setBalanceData(balanceData.financialBalance);
    };

    fetchBalanceData();
  }, []);

  return { balanceData, balanceCostSum, balanceIncomeSum, balanceTotal };
};
