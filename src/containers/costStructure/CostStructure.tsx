import React, { useEffect, useState } from "react";
import {
  Container,
  List,
  Divider,
  ListItemText,
  ListItemButton,
  Button,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/NavBar/Navbar";
import { PieChart } from "@mui/x-charts/PieChart";
import serverAddress from "../../utils/server";
import { CategoriesTotal } from "types/category.entity";

const CostStructure = () => {
  const [categoriesData, setCategoriesData] = useState<CategoriesTotal[]>();

  // const valueOfCategory = {};

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch(serverAddress + `/cost-structure`);
      const categoriesData = await res.json();
      setCategoriesData(categoriesData);
      console.log("dane categories", categoriesData);
    } catch (error) {
      console.error("Błąd podczas pobierania danych kategorii:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);
  const arrForChart =
    categoriesData?.map((category, index) => ({
      id: index,
      value: category.total,
      label: category.category,
    })) || undefined;

  // eslint-disable-next-line no-console
  console.log("x");
  return (
    <Container disableGutters={true}>
      <NavBar />
      <List component="nav" aria-label="mailbox folders">
        {categoriesData &&
          categoriesData.map((category, index) => (
            <>
              <ListItemButton key={index + "listItem"}>
                <ListItemText
                  key={index + "textInItem"}
                  primary={category.category}
                />
                <Box key={index + "total"}>{category.total}</Box>
              </ListItemButton>
              <Divider key={index + "divider"} />
            </>
          ))}
      </List>
      <Button variant="outlined" color="success">
        <AddIcon /> Dodaj nową kategorię
      </Button>
      {arrForChart && (
        <PieChart
          series={[
            {
              data: arrForChart,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          width={600}
          height={300}
        />
      )}
    </Container>
  );
};

export default CostStructure;
