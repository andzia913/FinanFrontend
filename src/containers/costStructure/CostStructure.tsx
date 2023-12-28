import { useEffect, useState } from "react";
import {
  Container,
  List,
  ListItemText,
  ListItem,
  Button,
  Box,
  FormControl,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import NavBar from "../../components/NavBar/Navbar";
import { PieChart } from "@mui/x-charts/PieChart";
import serverAddress from "../../utils/server";
import { CategoriesTotal } from "types/category.entity";
import fetchOptionsGETWithToken from "../../utils/fetchOptionsGETWithToken";

const CostStructure = () => {
  const [categoriesData, setCategoriesData] = useState<CategoriesTotal[]>();
  const [isVisibleFormAdd, setIsVisibleFormAdd] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [alert, setAlert] = useState({ isShown: false, text: "" });

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch(
        serverAddress + `/cost-structure`,
        fetchOptionsGETWithToken
      );
      const categoriesData = await res.json();
      setCategoriesData(categoriesData);
    } catch (error) {
      console.error("Błąd podczas pobierania danych kategorii:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (categoriesData?.find((item) => item.category === categoryName)) {
        setAlert({ isShown: true, text: "Podana kategoria już istnieje." });
        return;
      }
      const response = await fetch(serverAddress + `/cost-structure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ category_name: categoryName }),
      });
      if (response.ok) {
        fetchCategoriesData();
        setIsVisibleFormAdd(false);
        setCategoryName("");
      } else if (response.status === 401) {
        setAlert({
          isShown: true,
          text: "Wprowadzono błędne dane.",
        });
      } else {
        console.error("Błąd podczas wysyłania danych na serwer.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer.", error);
    }
  };
  const onDeleteClick = async (id: string, total: number) => {
    if (total !== 0) {
      setAlert({
        isShown: true,
        text: "Nie można usunąć kategorii, jeżeli są z nią powiązane inne rekordy",
      });
      console.error("Cannot delete item with another records relations ");
      return;
    }
    try {
      const response = await fetch(
        serverAddress + `/cost-structure/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      if (response.ok) {
        fetchCategoriesData();
      }
      if (response.status === 404) {
        setAlert({
          isShown: true,
          text: "Nie można usunąć wybranego rekordu, spróbuj ponownie później",
        });
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer. DELETE", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const arrForChart =
    categoriesData?.map((category, index) => ({
      id: index,
      value: category.total,
      label:
        category.category.length > 25
          ? category.category.slice(0, 22) + "..."
          : category.category,
    })) || undefined;

  return (
    <Container disableGutters={true}>
      <NavBar />
      {alert && (
        <Snackbar
          open={alert.isShown}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setAlert({ isShown: false, text: "" })}
        >
          <Alert severity="error">{alert.text}</Alert>
        </Snackbar>
      )}
      <List component="nav" aria-label="mailbox folders">
        {categoriesData &&
          categoriesData.map((category) => (
            <ListItem
              key={category.id}
              divider
              secondaryAction={
                <IconButton
                  onClick={() => onDeleteClick(category.id, category.total)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={category.category} />
              <Box style={{ marginRight: "10%" }}>
                {category.total.toFixed(2)} zł
              </Box>
            </ListItem>
          ))}
      </List>
      {!isVisibleFormAdd ? (
        <Button
          onClick={() => setIsVisibleFormAdd(true)}
          variant="outlined"
          color="success"
        >
          <AddIcon /> Dodaj nową kategorię
        </Button>
      ) : (
        <FormControl>
          <TextField
            required
            id="outlined-required"
            label="Wprowadź nazwę kategorii"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            onClick={() => handleSubmit()}
            variant="outlined"
            color="success"
            type="submit"
          >
            <AddIcon /> Dodaj
          </Button>
        </FormControl>
      )}

      {arrForChart && (
        <PieChart
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "middle" },
              padding: 15,
            },
          }}
          series={[
            {
              data: arrForChart,
              outerRadius: 120,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          width={undefined}
          height={600}
        />
      )}
    </Container>
  );
};

export default CostStructure;
