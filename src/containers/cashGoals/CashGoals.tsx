import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";

import { useState, useEffect } from "react";
import LinearWithValueLabel from "../../components/ProgressBarWithLabel/ProgressBarWithLabel";
import AddGoalForm from "../../components/AddGoalForm/AddGoalForm";
import serverAddress from "../../utils/server";
import { GoalEntity } from "../../types/goal.entity";

const CashGoals = () => {
  const [progress, setProgress] = useState(10);
  const [goalsData, setGoalsData] = useState<GoalEntity[] | null>();
  const [isVisibleAddCash, setIsVisibleAddCash] = useState(false);
  const [valueForGoal, setValueForGoal] = useState(0);

  const fetchGoalsData = async () => {
    try {
      const res = await fetch(serverAddress + `/cash-goals`);
      const goalsData = await res.json();
      const goalsDataWithFormattedDate = goalsData.map((goal: GoalEntity) => {
        const formattedDate = new Date(goal.date).toLocaleDateString();
        return { ...goal, date: formattedDate };
      });
      console.log("cashgoals", goalsData);
      setGoalsData(goalsDataWithFormattedDate);
      console.log("dane goals", goalsDataWithFormattedDate);
    } catch (error) {
      console.error("Błąd podczas pobierania danych celów:", error);
    }
  };
  useEffect(() => {
    fetchGoalsData();
  }, []);

  const handleAddGoal = async (goal: GoalEntity) => {
    try {
      console.log(goal, "to probujemy wysłać");
      const response = await fetch(serverAddress + "/cash-goals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goal),
      });
      fetchGoalsData();
      if (response.ok) {
        const responseData = await response.json();
        console.log("Dane zostały pomyślnie wysłane na serwer.", responseData);
      } else {
        console.error("Błąd podczas wysyłania danych na serwer.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer.", error);
    }
  };
  if (goalsData) {
    console.log(typeof goalsData[0].date);
  }
  const handleAddCash = (e: React.FormEvent, id: string, name: string) => {
    e.preventDefault();
    setIsVisibleAddCash(true);
    console.log(id, name);
  };

  return (
    <Container disableGutters={true}>
      <NavBar />
      <Typography variant="h4" color="primary" gutterBottom>
        Cele oszczędnościowe{" "}
      </Typography>
      {goalsData &&
        goalsData.map((goal) => (
          <Box>
            <Typography variant="h2" color="secondary" gutterBottom>
              {goal.goal_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Cel: ${goal.value}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Aktualnie odłożono: ${"currentValue"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Data realizacji:{" "}
              {goal.date instanceof Date
                ? goal.date.toLocaleDateString()
                : goal.date}
            </Typography>
            <LinearWithValueLabel value={progress} />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={() =>
                isVisibleAddCash
                  ? setIsVisibleAddCash(false)
                  : setIsVisibleAddCash(true)
              }
            >
              Dodaj na ten cel
            </Button>
            {isVisibleAddCash ?? (
              <>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <TextField
                    id="value"
                    label="Wartość"
                    type="number"
                    value={valueForGoal}
                    onChange={(e) => setValueForGoal(Number(e.target.value))}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={(e) => handleAddCash(e, goal.id, goal.goal_name)}
                >
                  Dodaj
                </Button>
              </>
            )}
          </Box>
        ))}
      <AddGoalForm onAddGoal={handleAddGoal} />
    </Container>
  );
};

export default CashGoals;
