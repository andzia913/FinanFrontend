import { useEffect, useState } from "react";
import {
  Container,
  List,
  Divider,
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
  const [alert, setAlert] = useState(false);

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
      const response = await fetch(serverAddress + `/cost-structure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ category_name: categoryName }),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Dane zostały pomyślnie wysłane na serwer.", responseData);
        fetchCategoriesData();
      } else {
        console.error("Błąd podczas wysyłania danych na serwer.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer.", error);
    }
  };
  const onDeleteClick = async (id: string, total: number) => {
    if (total !== 0) {
      setAlert(true);
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
        const responseData = response;
        fetchCategoriesData();
        console.log("Dane zostały pomyślnie usunięte.", responseData);
      }
      if (response.status === 400) {
        setAlert(true);
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
      label: category.category,
    })) || undefined;

  return (
    <Container disableGutters={true}>
      <NavBar />
      {alert && (
        <Snackbar
          open={alert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setAlert(false)}
        >
          <Alert severity="error">
            Nie można usunąć kategorii z powiązanymi rekordami
          </Alert>
        </Snackbar>
      )}
      <List component="nav" aria-label="mailbox folders">
        {categoriesData &&
          categoriesData.map((category) => (
            <>
              <ListItem
                key={category.id}
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
                <Box style={{ marginLeft: "15%", marginRight: "15%" }}>
                  {category.total}
                </Box>
              </ListItem>
              <Divider />
            </>
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
            <AddIcon /> Dodaj nową kategorię
          </Button>
        </FormControl>
      )}

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
