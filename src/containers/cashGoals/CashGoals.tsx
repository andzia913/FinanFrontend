import React, { useState, useEffect } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";
import AddGoalForm from "../../components/AddGoalForm/AddGoalForm";
import fetchOptionsGETWithToken from "../../utils/fetchOptionsGETWithToken";
import serverAddress from "../../utils/server";
import { GoalEntity, GoalEntityWithSum } from "../../types/goal.entity";
import GoalCard from "../../components/GoalCard/GoalCard";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import AlertMessageProps from "../../types/alertMessage";
import GoalDetails from "../../components/GoalDetails/GoalDetails";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Stack from "@mui/material/Stack";

//TODO: Move API calls to separate file

const CashGoals = () => {
  const [goalsData, setGoalsData] = useState<GoalEntityWithSum[] | null>(null);
  const [oneGoalDetails, setOneGoalDetails] =
    useState<GoalEntityWithSum | null>(null);
  const [alert, setAlert] = useState<AlertMessageProps["alert"]>({
    isShown: false,
    severity: "success",
    text: "",
  });
  const [view, setView] = useState<"goals" | "goalDetails" | "addGoalForm">(
    "goals"
  );

  const fetchGoalsData = async () => {
    try {
      const res = await fetch(
        `${serverAddress}/cashGoals`,
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

  const handleOpenGoalsDetails = (
    e: React.FormEvent,
    goal: GoalEntityWithSum
  ) => {
    e.preventDefault();
    setView("goalDetails");
    setOneGoalDetails(goal);
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
          text: "Istnieje już cel o tej nazwie.",
        });
        return;
      }
      const response = await fetch(`${serverAddress}/cashGoals/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(goal),
      });
      fetchGoalsData();
      if (response.ok) {
        setAlert({
          isShown: true,
          severity: "success",
          text: "Dodano nowy cel o nazwie : " + goal.goal_name,
        });
        setView("goals");
      } else if (response.status === 401) {
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

  const handleAddToGoal = async (
    e: React.FormEvent,
    name: string,
    value: number
  ) => {
    e.preventDefault();
    const goalData = goalsData?.find((goal) => goal.goal_name === name);
    let correctedValue;
    if (goalData && goalData?.currValue + value > goalData?.value) {
      correctedValue = goalData.value - goalData.currValue;
      setAlert({
        isShown: true,
        severity: "error",
        text: `Podana kwota przekracza wartość celu, dodano tylko ${(
          goalData.value - goalData.currValue
        ).toFixed(2)}`,
      });
    }
    try {
      const response = await fetch(
        `${serverAddress}/cashGoals/add/dedicated-amount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            goal_name: name,
            value: correctedValue ? correctedValue : value,
          }),
        }
      );
      if (response.ok) {
        fetchGoalsData();
        setView("goals");
        setAlert({
          isShown: true,
          text: `Kwota dodana pomyślnie na cel: ${name}`,
          severity: "success",
        });
      } else {
        console.error("Błąd podczas wysyłania danych na serwer.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer.", error);
    }
  };

  return (
    <Container disableGutters>
      <NavBar />
      <AlertMessage alert={alert} setAlert={setAlert} />
      {view !== "goals" && (
        <Stack direction="row" alignItems={"flex-start"}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setView("goals")}
          >
            <KeyboardArrowLeftIcon />
            Wróć
          </Button>
        </Stack>
      )}
      <Typography variant="h4" color="primary" gutterBottom>
        Cele oszczędnościowe
      </Typography>
      {view === "goalDetails" && oneGoalDetails && (
        <GoalDetails goal={oneGoalDetails} handleAddToGoal={handleAddToGoal} />
      )}
      {view === "goals" && goalsData && (
        <Grid
          container
          spacing={{ xs: 2, md: 8 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {goalsData.map((goal) => (
            <GoalCard
              goal={goal}
              key={goal.goal_name}
              handleOpenGoalsDetails={handleOpenGoalsDetails}
            />
          ))}
          <Button onClick={() => setView("addGoalForm")}>Add new goal</Button>
        </Grid>
      )}

      {view === "addGoalForm" && <AddGoalForm onAddGoal={handleAddGoal} />}
    </Container>
  );
};

export default CashGoals;
