import {
  Alert,
  AlertColor,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";

import { useState, useEffect } from "react";
import LinearWithValueLabel from "../../components/ProgressBarWithLabel/ProgressBarWithLabel";
import AddGoalForm from "../../components/AddGoalForm/AddGoalForm";
import serverAddress from "../../utils/server";
import { GoalEntity, GoalEntityWithSum } from "../../types/goal.entity";

interface AlertType {
  isShown: boolean;
  severity: AlertSeverityOption;
  text: string;
}
enum AlertSeverityOption {
  error = "error",
  succes = "success",
}

const CashGoals = () => {
  const [goalsData, setGoalsData] = useState<GoalEntityWithSum[] | null>();
  const [isVisibleAddCash, setIsVisibleAddCash] = useState<{
    [key: string]: boolean;
  }>({});
  const [valueForGoal, setValueForGoal] = useState<{ [key: string]: number }>(
    {}
  );
  const [alert, setAlert] = useState<AlertType>({
    isShown: false,
    severity: AlertSeverityOption.error,
    text: "",
  });

  const fetchGoalsData = async () => {
    try {
      const res = await fetch(serverAddress + `/cash-goals`);
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
          severity: AlertSeverityOption.error,
          text: "Cel nie może mieć wartości równej, bądź mniejszej od 0.",
        });
        return;
      }
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

  const handleAddToGoal = async (e: React.FormEvent, name: string) => {
    e.preventDefault();
    setIsVisibleAddCash((prev) => ({ ...prev, [name]: true }));
    try {
      const response = await fetch(
        serverAddress + "/cash-goals/add/dedicated-amount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goal_name: name, value: valueForGoal[name] }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        fetchGoalsData();
        setIsVisibleAddCash((prev) => ({ ...prev, [name]: false }));
        setAlert({
          isShown: true,
          severity: AlertSeverityOption.succes,
          text: `Kwota dodana pomyślnie na cel: ${name}`,
        });
        console.log("Dane zostały pomyślnie wysłane na serwer.", responseData);
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
      {alert && (
        <Snackbar
          open={alert.isShown}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() =>
            setAlert({
              isShown: false,
              text: "",
              severity: AlertSeverityOption.error,
            })
          }
        >
          <Alert severity={alert.severity}>{alert.text}</Alert>
        </Snackbar>
      )}
      <Typography variant="h4" color="primary" gutterBottom>
        Cele oszczędnościowe{" "}
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 8 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {goalsData &&
          goalsData.map((goal) => (
            <Grid item xs={6} key={goal.goal_name}>
              <Paper elevation={3} style={{ padding: "16px" }}>
                <Box key={goal.goal_name}>
                  <Typography variant="h2" color="secondary" gutterBottom>
                    {goal.goal_name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Cel: {goal.value} zł
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Aktualnie odłożono: {goal.currValue} zł
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Data realizacji:{" "}
                    {goal.date instanceof Date
                      ? goal.date.toLocaleDateString()
                      : goal.date}
                  </Typography>
                  <LinearWithValueLabel
                    value={
                      goal.value !== 0 ? (goal.currValue / goal.value) * 100 : 0
                    }
                  />
                  {goal.currValue >= goal.value ? (
                    <Button
                      variant="outlined"
                      style={{ color: "lightgreen" }}
                      disabled
                    >
                      Cel zrealizowany!
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      onClick={() =>
                        setIsVisibleAddCash((prev) => ({
                          ...prev,
                          [goal.goal_name]: !prev[goal.goal_name],
                        }))
                      }
                    >
                      Dodaj na ten cel
                    </Button>
                  )}

                  {isVisibleAddCash[goal.goal_name] && (
                    <>
                      <FormControl fullWidth margin="normal" variant="outlined">
                        <TextField
                          id={`value-${goal.goal_name}`}
                          label="Wartość"
                          type="number"
                          value={valueForGoal[goal.goal_name]}
                          onChange={(e) =>
                            setValueForGoal({
                              ...valueForGoal,
                              [goal.goal_name]: Number(e.target.value),
                            })
                          }
                        />
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={(e) => handleAddToGoal(e, goal.goal_name)}
                      >
                        Dodaj
                      </Button>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>
      <AddGoalForm onAddGoal={handleAddGoal} />
    </Container>
  );
};

export default CashGoals;
