import { useState, useEffect } from "react";
import serverAddress from "../utils/server";
import fetchOptionsGETWithToken from "../utils/fetchOptionsGETWithToken";
import { CategoriesTotal } from "types/category.entity";

export const useCategoriesData = () => {
  const [categoriesData, setCategoriesData] = useState<CategoriesTotal[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch(
          serverAddress + `/costStructure`,
          fetchOptionsGETWithToken
        );
        const categoriesData = await categoriesRes.json();
        setCategoriesData(categoriesData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchData();
  }, []);

  return categoriesData;
};
