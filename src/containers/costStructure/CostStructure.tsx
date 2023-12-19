import {
  Container,
  List,
  Divider,
  ListItemText,
  ListItemButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/NavBar/Navbar";
import { PieChart } from "@mui/x-charts/PieChart";

import React, { useState } from "react";
import serverAddress from "../../utils/server";

const CostStructure = () => {
  // [categories, setCategories] = useState();

  // const valueOfCategory = {};

  const fetchCategoriesData = async () => {
    const res = await fetch(serverAddress + `/cost-structure`);
    // const categoriesData= await res.json();
    // const dataCorectedDate = { ...data, date: new Date(data.date) };
    // setRecordToEdit(dataCorectedDate);
    // setIsVisibleFormEdit(true);
    // console.log("dane recordu do edycji", dataCorectedDate);
  };
  fetchCategoriesData();

  // eslint-disable-next-line no-console
  console.log("x");
  return (
    <Container disableGutters={true}>
      <NavBar />
      <List component="nav" aria-label="mailbox folders">
        <ListItemButton>
          <ListItemText primary="Inbox" />
        </ListItemButton>
        <Divider />
        <ListItemButton divider>
          <ListItemText primary="Drafts" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Trash" />
        </ListItemButton>
        <Divider light />
        <ListItemButton>
          <ListItemText primary="Spam" />
        </ListItemButton>
      </List>
      <Button variant="outlined" color="success">
        <AddIcon /> Dodaj nową kategorię
      </Button>

      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "series A" },
              { id: 1, value: 15, label: "series B" },
            ],
          },
        ]}
        width={400}
        height={200}
      />
    </Container>
  );
};

export default CostStructure;
