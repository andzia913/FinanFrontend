import { useEffect, useState, useRef } from "react";
import TableBalance from "../../components/TableBalance/TableBalance.tsx";
import { tableColumns } from "../../components/TableBalance/tableColumns";
import FormBalanceRecord from "../../components/FormBalaceRecord/FormBalanceRecord.tsx";
import { BalanceEntity, FormData } from "types/balance.entity.ts";
import { CategoryEntity } from "types/category.entity.ts";
import { TypeEntity } from "types/type.entity.ts";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  Link,
  Snackbar,
} from "@mui/material";
import NavBar from "../../components/NavBar/Navbar.tsx";
import serverAddress from "../../utils/server.ts";
import fetchOptionsGETWithToken from "../../utils/fetchOptionsGETWithToken.tsx";

const FinancialBalance = () => {
  const [balanceData, setBalanceData] = useState<BalanceEntity[]>();
  const [categoriesData, setCategoriesData] = useState<CategoryEntity[]>();
  const [typesData, setTypesData] = useState<TypeEntity[]>();
  const [recordToEdit, setRecordToEdit] = useState<BalanceEntity | null>(null);
  const [isVisilbeFormAdd, setIsVisibleFormAdd] = useState(false);
  const [isVisilbeFormEdit, setIsVisibleFormEdit] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const balanceDataRef = useRef<BalanceEntity[] | null>(null);
  const categoriesDataRef = useRef<CategoryEntity[] | null>(null);
  const typesDataRef = useRef<TypeEntity[] | null>(null);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [alert, setAlert] = useState({ isShown: false, text: "" });

  const fetchBalanceData = async () => {
    const res = await fetch(
      serverAddress + "/financialBalance",
      fetchOptionsGETWithToken
    );
    const { financialBalance, balanceCostSum, balanceIncomeSum } =
      await res.json();
    const total = balanceIncomeSum.totalIncome - balanceCostSum.totalCost;
    setBalanceTotal(total);
    balanceDataRef.current = financialBalance;
    setBalanceData(financialBalance);
  };

  const handleEditClick = (id: string) => {
    const fetchRecordData = async () => {
      const response = await fetch(
        serverAddress + `/financialBalance/get-one/${id}`,
        fetchOptionsGETWithToken
      );
      const data: BalanceEntity = await response.json();
      const dataCorectedDate = { ...data, date: new Date(data.date) };
      setRecordToEdit(dataCorectedDate);
      setIsVisibleFormEdit(true);
    };
    fetchRecordData();
  };
  const handleSubmit = async (formData: FormData, isEditMode: boolean) => {
    if (isEditMode) {
      try {
        const response = await fetch(
          serverAddress + `/financialBalance/update/${formData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },

            body: JSON.stringify(formData),
          }
        );
        if (response.status === 403) {
          setAlert({
            isShown: true,
            text: "Nie mozna edytować danych dla tej kategorii ponieważ jest związana z realizacją celów oszczędnościowych. Możesz usunąć rekord.",
          });
          setIsVisibleFormEdit(false);
          return;
        }
        setRecordToEdit(null);
        fetchBalanceData();
        if (response.ok) {
          const responseData = await response.json();
          console.log("Dane zostały pomyślnie zaktualizoane.", responseData);
        } else {
          console.error("Błąd podczas wysyłania danych na serwer.");
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania danych na serwer.", error);
      }
      setIsVisibleFormEdit(false);
    } else {
      try {
        const response = await fetch(serverAddress + "/financialBalance/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(formData),
        });
        fetchBalanceData();
        if (response.ok) {
          const responseData = await response.json();
          console.log(
            "Dane zostały pomyślnie wysłane na serwer.",
            responseData
          );
        } else {
          console.error("Błąd podczas wysyłania danych na serwer.");
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania danych na serwer.", error);
      }
    }
  };

  useEffect(() => {
    if (balanceData && categoriesData && typesData) {
      console.log("useEffect", categoriesData, balanceData, typesData);
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [balanceData, categoriesData, typesData]);
  useEffect(() => {
    fetchBalanceData();
  }, [balanceDataRef]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const res = await fetch(
        serverAddress + "/financialBalance/categories",
        fetchOptionsGETWithToken
      );
      const categories: CategoryEntity[] = await res.json();
      categoriesDataRef.current = categories;
      setCategoriesData(categories);
    };

    fetchCategoriesData();
  }, [categoriesDataRef]);

  useEffect(() => {
    const fetchTypesData = async () => {
      const res = await fetch(
        serverAddress + "/financialBalance/types",
        fetchOptionsGETWithToken
      );
      const types: TypeEntity[] = await res.json();
      setTypesData(types);
    };

    fetchTypesData();
  }, [typesDataRef]);
  const handleClose = () => setIsVisibleFormEdit(false);

  return (
    <>
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
        <Box
          style={{
            border: `${
              balanceTotal > 0 ? "1px solid lightgreen" : "1px solid indianred"
            }`,
            padding: "15px 0",
          }}
        >
          Aktulany stan finansów
          <span
            style={{
              color: `${balanceTotal > 0 ? "lightgreen" : "indianred"}`,
              marginLeft: "15px",
            }}
          >
            {balanceTotal.toFixed(2)} zł
          </span>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsVisibleFormAdd(isVisilbeFormAdd ? false : true)}
          disabled={categoriesData?.length === 0}
          style={{ margin: "10px" }}
        >
          Dodaj nowy rekord
        </Button>
        {categoriesData?.length === 0 && (
          <Alert severity="info">
            Aby dodać recordy do bilansu, potrzebujesz najpierw zdefiniować
            kategorie, możesz przejść <Link href="/cost-structure">tutaj</Link>.
          </Alert>
        )}

        {loadingData ? (
          <CircularProgress />
        ) : (
          <>
            {isVisilbeFormAdd ? (
              <Grid container justifyContent="center">
                <Grid item xs={10} sm={8} md={6} lg={4}>
                  <FormBalanceRecord
                    categories={categoriesData!}
                    types={typesData!}
                    recordToEdit={recordToEdit!}
                    handleSubmit={handleSubmit}
                  />
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            <Dialog open={isVisilbeFormEdit} onClose={handleClose}>
              <FormBalanceRecord
                categories={categoriesData!}
                types={typesData!}
                recordToEdit={recordToEdit}
                handleSubmit={handleSubmit}
              />
            </Dialog>
            <TableBalance
              columns={tableColumns}
              data={balanceData!}
              handleEditClick={handleEditClick}
              handleDeleteClick={fetchBalanceData}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default FinancialBalance;
