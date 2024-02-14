import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { GoalEntityWithSum } from "../../types/goal.entity";
import LinearProgressWithLabel from "../../components/ProgressBarWithLabel/ProgressBarWithLabel";

type GoalCardProps = {
  goalsData: GoalEntityWithSum[] | null;
  handleAddToGoal: Function;
  isVisibleAddCash: { [key: string]: boolean };
  setIsVisibleAddCash: Function;
  valueForGoal: { [key: string]: number };
  setValueForGoal: Function;
};
const GoalCard = ({
  goalsData,
  handleAddToGoal,
  isVisibleAddCash,
  setIsVisibleAddCash,
  valueForGoal,
  setValueForGoal,
}: GoalCardProps) => {
  return (
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
                <LinearProgressWithLabel
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
                    onClick={() => {
                      setIsVisibleAddCash(
                        (prev: GoalCardProps["isVisibleAddCash"]) => ({
                          ...prev,
                          [goal.goal_name]: !prev[goal.goal_name],
                        })
                      );
                      setValueForGoal({
                        ...valueForGoal,
                        [goal.goal_name]: 0,
                      });
                    }}
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
                        inputProps={{ min: "0" }}
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
  );
};

export default GoalCard;
