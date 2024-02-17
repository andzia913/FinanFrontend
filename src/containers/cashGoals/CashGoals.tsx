import React, { useState, useEffect } from "react";
import { Button, Container, Typography, Stack } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavBar from "../../components/NavBar/Navbar";
import AddGoalForm from "../../components/AddGoalForm/AddGoalForm";
import fetchOptionsGETWithToken from "../../utils/fetchOptionsGETWithToken";
import serverAddress from "../../utils/server";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import GoalDetails from "../../components/GoalDetails/GoalDetails";
import { GoalEntity, GoalEntityWithSum } from "../../types/goal.entity";
import AlertMessageProps from "../../types/alertMessage";
import GoalCards from "../../components/GoalCards/GoalCards";
import AddIcon from "@mui/icons-material/Add";

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
      if (
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
    // TODO: Add id
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
            value: value,
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
            startIcon={<KeyboardArrowLeftIcon />}
          >
            Wróć
          </Button>
        </Stack>
      )}
      <Typography variant="h4" color="primary" gutterBottom>
        Cele oszczędnościowe
      </Typography>
      {view === "goals" && goalsData && (
        <>
          <Button
            color="success"
            onClick={() => setView("addGoalForm")}
            startIcon={<AddIcon />}
          >
            Dodaj nowy cel
          </Button>
          <GoalCards
            goalsData={goalsData}
            handleOpenGoalsDetails={handleOpenGoalsDetails}
          />
        </>
      )}
      {view === "addGoalForm" && <AddGoalForm onAddGoal={handleAddGoal} />}
      {view === "goalDetails" && oneGoalDetails && (
        <GoalDetails goal={oneGoalDetails} handleAddToGoal={handleAddToGoal} />
      )}
    </Container>
  );
};

export default CashGoals;
