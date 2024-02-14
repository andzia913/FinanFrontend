import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import LinearProgressWithLabel from "../../components/ProgressBarWithLabel/ProgressBarWithLabel";
import { GoalEntityWithSum } from "types/goal.entity";
import { useRef } from "react";
import { FormEvent } from "react";

//TODO: Change styling of this element and data displaying
//TODO: Add button to close this view
//TODO: Add button to delete and edit this goal

const GoalDetails = ({
  goal,
  handleAddToGoal,
}: {
  goal: GoalEntityWithSum;
  handleAddToGoal: (
    e: FormEvent<Element>,
    name: string,
    value: number
  ) => Promise<void>;
}) => {
  const valueForGoalRef = useRef<HTMLInputElement>(null);
  return (
    <Grid item xs={6}>
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
          value={goal.value !== 0 ? (goal.currValue / goal.value) * 100 : 0}
        />
        {goal.currValue >= goal.value ? (
          <Button variant="outlined" style={{ color: "lightgreen" }} disabled>
            Cel zrealizowany!
          </Button>
        ) : (
          <Box
            component="form"
            onSubmit={(e) =>
              handleAddToGoal(
                e,
                goal.goal_name,
                Number(valueForGoalRef.current?.value)
              )
            }
          >
            <TextField
              inputRef={valueForGoalRef}
              id={`value-${goal.goal_name}`}
              label="Wartość"
              type="number"
              inputProps={{ min: "1" }}
            />
            <Button variant="contained" color="primary" type="submit">
              Dodaj na ten cel
            </Button>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default GoalDetails;
