import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const LinearProgressWithLabel: React.FC<{ value: number }> = ({ value }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          style={{ height: "15px" }}
          variant="determinate"
          value={value}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
