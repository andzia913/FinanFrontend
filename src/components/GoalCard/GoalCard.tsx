import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { GoalEntityWithSum } from "../../types/goal.entity";
import LinearProgressWithLabel from "../../components/ProgressBarWithLabel/ProgressBarWithLabel";

type GoalCardProps = {
  goal: GoalEntityWithSum;
  key: string;
  handleOpenGoalsDetails: Function;
};

//TODO: Change this to maps GoalsCards.. add key to each card
//TODO: Add button to close this view

const GoalCard = ({ goal, handleOpenGoalsDetails, key }: GoalCardProps) => {
  return (
    <Grid item xs={6}>
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
            value={goal.value !== 0 ? (goal.currValue / goal.value) * 100 : 0}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={(e) => handleOpenGoalsDetails(e, goal)}
          >
            Zobacz szczegóły
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default GoalCard;
