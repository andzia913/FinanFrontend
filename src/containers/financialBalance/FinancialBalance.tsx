import { useEffect, useState, useRef } from "react";
import TableBalance from "../../components/TableBalance/TableBalance.tsx";
import { tableColumns } from "../../components/TableBalance/tableColumns";
import FormBalanceRecord from "../../components/FormBalaceRecord/FormBalanceRecord.tsx";
import { BalanceEntity } from "types/balance.entity.ts";
import { CategoryEntity } from "types/category.entity.ts";
import { TypeEntity } from "types/type.entity.ts";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
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

  const fetchBalanceData = async () => {
    const res = await fetch(
      serverAddress + "/financialBalance",
      fetchOptionsGETWithToken
    );
    const { financialBalance, balanceCostSum, balanceIncomeSum } =
      await res.json();
    const total = balanceIncomeSum.totalIncome - balanceCostSum.totalCost;
    setBalanceTotal(Number(total.toFixed(2)));
    balanceDataRef.current = financialBalance;
    setBalanceData(financialBalance);
  };

  const handleEditClick = (id: string) => {
    const fetchRecordData = async () => {
      const res = await fetch(
        serverAddress + `/financialBalance/get-one/${id}`,
        fetchOptionsGETWithToken
      );
      const data: BalanceEntity = await res.json();
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
      // typesDataRef.current = types;
      setTypesData(types);
    };

    fetchTypesData();
  }, [typesDataRef]);

  return (
    <>
      <Container disableGutters={true}>
        <NavBar />
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
            {balanceTotal} zł
          </span>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsVisibleFormAdd(isVisilbeFormAdd ? false : true)}
        >
          Dodaj nowy rekord
        </Button>

        {loadingData ? (
          <CircularProgress />
        ) : (
          <>
            {isVisilbeFormAdd ? (
              <FormBalanceRecord
                categories={categoriesData!}
                types={typesData!}
                recordToEdit={recordToEdit!}
                handleSubmit={handleSubmit}
              />
            ) : (
              ""
            )}
            <Dialog open={isVisilbeFormEdit} maxWidth={undefined}>
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
