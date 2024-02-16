import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { GoalEntity } from "../../types/goal.entity";
import { Typography } from "@mui/material";

interface AddGoalFormProps {
  onAddGoal: (goal: GoalEntity) => void;
}
// TODO: Add validation for date , cannot be past
const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const goalNameRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLInputElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);

  const handleAddGoal = (
    event: React.FormEvent,
    goalNameRef: React.RefObject<HTMLInputElement>,
    valueRef: React.RefObject<HTMLInputElement>,
    dateRef: React.RefObject<HTMLInputElement>
  ) => {
    event.preventDefault();
    if (
      goalNameRef.current?.value &&
      valueRef.current?.value &&
      dateRef.current?.value
    ) {
      const formattedDate = new Date(dateRef.current?.value);
      onAddGoal({
        goal_name: goalNameRef.current.value,
        value: Number(valueRef.current.value),
        date: formattedDate,
      });
    }
  };

  return (
    <Box style={{ margin: "50px auto", maxWidth: "400px" }}>
      <Typography variant="h6" gutterBottom color="primary">
        Tutaj możesz zdefiniować nowy cel oszczędnościowy
      </Typography>
      <Box
        component="form"
        onSubmit={(e) => handleAddGoal(e, goalNameRef, valueRef, dateRef)}
      >
        <TextField
          inputRef={goalNameRef}
          id="goal-name"
          label="Nazwa celu"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          inputRef={valueRef}
          id="value"
          label="Wartość"
          type="number"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          inputRef={dateRef}
          id="end-date"
          label="Data realizacji"
          type="date"
          margin="normal"
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button variant="contained" color="primary" type="submit">
          Dodaj
        </Button>
      </Box>
    </Box>
  );
};

export default AddGoalForm;
