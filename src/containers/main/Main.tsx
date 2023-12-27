import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/Navbar";
import serverAddress from "../../utils/server";
import { GoalEntityWithSum } from "../../types/goal.entity";
import { CategoriesTotal } from "types/category.entity";
import LinearWithValueLabel from "../../components/ProgressBarWithLabel/ProgressBarWithLabel";
import fetchOptionsGETWithToken from "../../utils/fetchOptionsGETWithToken";

const HomePage = () => {
  const [goalsData, setGoalsData] = useState<GoalEntityWithSum[] | null>();
  const [categoriesData, setCategoriesData] = useState<CategoriesTotal[]>();
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [balanceCosts, setBalanceCosts] = useState(0);
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [lastUpdateDate, setLastUpdateDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goalsRes = await fetch(
          serverAddress + `/cash-goals`,
          fetchOptionsGETWithToken
        );
        const goalsData = await goalsRes.json();

        const categoriesRes = await fetch(
          serverAddress + `/cost-structure`,
          fetchOptionsGETWithToken
        );
        const categoriesData = await categoriesRes.json();

        const balanceRes = await fetch(
          serverAddress + "/financialBalance",
          fetchOptionsGETWithToken
        );
        const { financialBalance, balanceCostSum, balanceIncomeSum } =
          await balanceRes.json();
        const total = balanceIncomeSum.totalIncome - balanceCostSum.totalCost;
        const costs = balanceCostSum.totalCost;
        const income = balanceIncomeSum.totalIncome;
        const lastUpdate = financialBalance.length
          ? new Date(financialBalance[0].date).toLocaleDateString()
          : "";

        setGoalsData(goalsData);
        setCategoriesData(categoriesData);
        setBalanceTotal(Number(total.toFixed(2)));
        setBalanceCosts(costs);
        setBalanceIncome(income);
        setLastUpdateDate(lastUpdate);
        setLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    fetchData();
  }, []);

  const renderBalanceData = (
    balanceCosts: number,
    balanceIncome: number,
    balanceTotal: number,
    linkTo: string
  ) => (
    <Grid item xs={12}>
      <Card variant="outlined" style={{ height: "100%" }}>
        <CardHeader title="Bilans przychodów i kosztów" />
        <CardContent>
          <Typography variant="h4" color="primary" gutterBottom>
            Wynik: {balanceTotal} zł
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Koszty: {balanceCosts} zł
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Przychody: {balanceIncome} zł
          </Typography>
          <Button
            component={Link}
            to={linkTo}
            variant="outlined"
            color="primary"
          >
            Przejdź
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderGoalInfo = (title: string, value: number, date: string) => (
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Card variant="outlined" style={{ height: "100%" }}>
        <CardHeader color="primary" title={title} />
        <CardContent>
          <Typography variant="body1" color="primary" gutterBottom>
            Data realizacji: {date}
          </Typography>
          <LinearWithValueLabel value={value} />
        </CardContent>
      </Card>
    </Grid>
  );

  const renderStructureTile = (title: string, percent: number) => (
    <Grid item xs={12} sm={12} md={4} lg={4}>
      <Card variant="outlined" style={{ height: "100%" }}>
        <CardHeader title={title} />
        <CardContent>
          <Typography variant="h4" color="primary" gutterBottom>
            {`${percent.toFixed(2)}%`}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {`Kategoria: ${title}`}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container>
      <NavBar />

      <Grid container spacing={2} direction={"column"}>
        {!loading ? (
          <>
            {renderBalanceData(
              balanceCosts,
              balanceIncome,
              balanceTotal,
              "/financial-balance"
            )}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Card
                variant="outlined"
                style={{ height: "100%", padding: "10px" }}
              >
                <CardHeader title="Koszty" />
                <Grid container>
                  {categoriesData &&
                    categoriesData
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 3)
                      .map((category) =>
                        renderStructureTile(
                          category.category,
                          (category.total / balanceCosts) * 100
                        )
                      )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Card
                variant="outlined"
                style={{ height: "100%", padding: "10px" }}
              >
                <CardHeader title="Cele oszczędnościowe" />
                <Grid container>
                  {goalsData &&
                    goalsData
                      .slice(0, 3)
                      .map((goal) =>
                        renderGoalInfo(
                          goal.goal_name,
                          (goal.currValue / goal.value) * 100,
                          new Date(goal.date).toLocaleDateString()
                        )
                      )}
                </Grid>
                <Button
                  component={Link}
                  to="/cash-goals"
                  variant="outlined"
                  color="primary"
                >
                  Przejdź
                </Button>
              </Card>
            </Grid>
          </>
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
