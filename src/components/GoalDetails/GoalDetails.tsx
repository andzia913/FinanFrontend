import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
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
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <Box sx={{ maxWidth: 700 }}>
          <Box key={goal.goal_name}>
            <Typography variant="h5" gutterBottom>
              Twój cel:{" "}
              <Typography
                variant="h5"
                color="secondary"
                display={"inline-block"}
              >
                {goal.goal_name}
              </Typography>
            </Typography>
            <Typography variant="h5" gutterBottom>
              Wartość:{" "}
              <Typography
                variant="h5"
                color="secondary"
                display={"inline-block"}
              >
                {goal.value} zł
              </Typography>
            </Typography>
            <Typography variant="h5" gutterBottom>
              Aktualne odłożono:{" "}
              <Typography
                variant="h5"
                color="secondary"
                display={"inline-block"}
              >
                {goal.currValue} zł
              </Typography>
            </Typography>

            <Typography variant="h5" gutterBottom>
              Data realizacji:{" "}
              <Typography
                variant="h5"
                color="secondary"
                display={"inline-block"}
              >
                {`${goal.date}`}
              </Typography>
            </Typography>
            <LinearProgressWithLabel
              value={goal.value !== 0 ? (goal.currValue / goal.value) * 100 : 0}
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
                <Stack
                  direction="row"
                  alignContent={"center"}
                  justifyContent={"center"}
                >
                  <TextField
                    inputRef={valueForGoalRef}
                    id={`value-${goal.goal_name}`}
                    label="Wartość"
                    type="number"
                    inputProps={{ min: "1" }}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Dodaj
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default GoalDetails;
