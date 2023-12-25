import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { GoalEntity } from "../../types/goal.entity";
import { Typography } from "@mui/material";

interface AddGoalFormProps {
  onAddGoal: (goal: GoalEntity) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [goalName, setGoalName] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [date, setDate] = React.useState("");

  const handleAddGoal = (event: React.FormEvent) => {
    event.preventDefault();
    const formattedDate = new Date(date);
    onAddGoal({ goal_name: goalName, value: value, date: formattedDate });

    setGoalName("");
    setValue(0);
    setDate("");
  };

  return (
    <Box style={{ marginTop: "50px", maxWidth: "400px", margin: "auto" }}>
      <Typography variant="h6" gutterBottom color="primary">
        Tutaj możesz zdefiniować nowy cel oszczędnościowy
      </Typography>
      <FormControl fullWidth margin="normal" variant="outlined">
        <TextField
          id="goal-name"
          label="Nazwa celu"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth margin="normal" variant="outlined">
        <TextField
          id="value"
          label="Wartość"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </FormControl>
      <FormControl fullWidth margin="normal" variant="outlined">
        <TextField
          id="end-date"
          label="Data realizacji"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={(e) => handleAddGoal(e)}
      >
        Dodaj
      </Button>
    </Box>
  );
};

export default AddGoalForm;
