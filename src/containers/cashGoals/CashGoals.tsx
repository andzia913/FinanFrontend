import { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";
import AddGoalForm from "../../components/AddGoalForm/AddGoalForm";
import fetchOptionsGETWithToken from "../../utils/fetchOptionsGETWithToken";
import serverAddress from "../../utils/server";
import { GoalEntity, GoalEntityWithSum } from "../../types/goal.entity";
import GoalCard from "../../components/GoalCard/GoalCard";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import AlertMessageProps from "types/alertMessage";

const CashGoals = () => {
  const [goalsData, setGoalsData] = useState<GoalEntityWithSum[] | null>(null);
  const [valueForGoal, setValueForGoal] = useState<{ [key: string]: number }>(
    {}
  );
  const [alert, setAlert] = useState<AlertMessageProps["alert"]>({
    isShown: false,
    severity: "success",
    text: "",
  });
  const [isVisibleAddCash, setIsVisibleAddCash] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchGoalsData = async () => {
    try {
      const res = await fetch(
        serverAddress + `/cashGoals`,
        fetchOptionsGETWithToken
      );
      const goalsData = await res.json();
      const goalsDataWithFormattedDate = goalsData.map(
        (goal: GoalEntityWithSum) => {
          const formattedDate = new Date(goal.date).toLocaleDateString();
          return { ...goal, date: formattedDate };
        }
      );
      setGoalsData(goalsDataWithFormattedDate);
    } catch (error) {
      console.error("Błąd podczas pobierania danych celów:", error);
    }
  };
  useEffect(() => {
    fetchGoalsData();
  }, []);

  const handleAddGoal = async (goal: GoalEntity) => {
    try {
      if (goal.value <= 0) {
        setAlert({
          isShown: true,
          severity: "error",
          text: "Cel nie może mieć wartości równej, bądź mniejszej od 0.",
        });
        return;
      } else if (
        goalsData?.find(
          (goalFromData) => goalFromData.goal_name === goal.goal_name
        )
      ) {
        setAlert({
          isShown: true,
          severity: "error",
          text: "Istneje już cel o tej nazwie.",
        });
        return;
      }
      const response = await fetch(serverAddress + "/cashGoals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(goal),
      });
      fetchGoalsData();
      // if (response.ok) {
      //   const responseData = await response.json();
      //   console.log("Dane zostały pomyślnie wysłane na serwer.", responseData);
      // } else
      if (response.status === 401) {
        setAlert({
          isShown: true,
          severity: "error",
          text: "Wprowadzono niepoprawne dane",
        });
        return;
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer.", error);
    }
  };

  const handleAddToGoal = async (e: React.FormEvent, name: string) => {
    e.preventDefault();
    setIsVisibleAddCash((prev) => ({ ...prev, [name]: true }));
    const goalData = goalsData?.find((goal) => goal.goal_name === name);
    let correctedValue;
    if (
      goalData &&
      goalData?.currValue + valueForGoal[name] > goalData?.value
    ) {
      correctedValue = goalData.value - goalData.currValue;
      setAlert({
        isShown: true,
        severity: "error",
        text: `Podana kwota przkraczała wartość celu, dodano tylko ${(
          goalData.value - goalData.currValue
        ).toFixed(2)}`,
      });
    }
    try {
      const response = await fetch(
        serverAddress + "/cashGoals/add/dedicated-amount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify({
            goal_name: name,
            value: correctedValue ? correctedValue : valueForGoal[name],
          }),
        }
      );
      console.log(valueForGoal);

      if (response.ok) {
        fetchGoalsData();
        setIsVisibleAddCash((prev) => ({ ...prev, [name]: false }));
        setAlert({
          isShown: true,
          severity: "success",
          text: `Kwota dodana pomyślnie na cel: ${name}`,
        });
        setValueForGoal({
          ...valueForGoal,
          [name]: 0,
        });
      } else {
        console.error("Błąd podczas wysyłania danych na serwer.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer.", error);
    }
  };

  return (
    <Container disableGutters={true}>
      <NavBar />
      <AlertMessage alert={alert} setAlert={setAlert} />
      <Typography variant="h4" color="primary" gutterBottom>
        Cele oszczędnościowe
      </Typography>
      <GoalCard
        goalsData={goalsData}
        handleAddToGoal={handleAddToGoal}
        isVisibleAddCash={isVisibleAddCash}
        setIsVisibleAddCash={setIsVisibleAddCash}
        setValueForGoal={setValueForGoal}
        valueForGoal={valueForGoal}
      />
      <AddGoalForm onAddGoal={handleAddGoal} />
    </Container>
  );
};

export default CashGoals;
