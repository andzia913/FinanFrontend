import { useEffect, useState } from "react";
import serverAddress from "../utils/server";
import fetchOptionsGETWithToken from "../utils/fetchOptionsGETWithToken";
import { GoalEntityWithSum } from "../types/goal.entity";

export const useGoalsData = () => {
  const [goalsData, setGoalsData] = useState<GoalEntityWithSum[] | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goalsRes = await fetch(
          serverAddress + `/cashGoals`,
          fetchOptionsGETWithToken
        );
        const goalsData = await goalsRes.json();
        setGoalsData(goalsData);
      } catch (error) {
        console.error("Error fetching goals data:", error);
      }
    };

    fetchData();
  }, []);

  return goalsData;
};
