import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { CategoryEntity } from "types/category.entity";
import { TypeEntity } from "types/type.entity";
import formatDateForInput from "../../utils/formatDateForInput";
import { BalanceEntity } from "types/balance.entity";
import { FormData } from "types/balance.entity";

const FormBalaceRecord = ({
  categories,
  types,
  recordToEdit,
  handleSubmit,
}: {
  categories: CategoryEntity[];
  types: TypeEntity[];
  recordToEdit: BalanceEntity | null;
  handleSubmit: Function;
}) => {
  const initialFormData: FormData = {
    id: "",
    id_type: types[0].id_type,
    type_name: types[0].type_name,
    date: new Date(),
    value: 0,
    id_category: categories[0].id_category,
    category_name: categories[0].category_name,
    comment: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [recordToEdit, setRecordToEdit] = useState(null);
  useEffect(() => {
    if (recordToEdit) {
      setIsEditMode(true);
      setFormData({
        id: recordToEdit.id,
        id_type: recordToEdit.id_type,
        type_name: recordToEdit.type_name,
        date: recordToEdit.date,
        value: recordToEdit.value,
        id_category: recordToEdit.id_category,
        category_name: recordToEdit.category_name,
        comment: recordToEdit.comment,
      });
    } else {
      setIsEditMode(false);
    }
  }, [recordToEdit]);

  const handleClickSubmit = (event: React.FormEvent, formData: FormData) => {
    event.preventDefault();
    setFormData(initialFormData);
    handleSubmit(formData, isEditMode);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={12}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Typ</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              required={true}
              value={formData.id_type}
              onChange={(e: SelectChangeEvent<string>) => {
                const selectedTypeId = e.target.value;
                const selectedType = types.find(
                  (type) => type.id_type === selectedTypeId
                );

                setFormData({
                  ...formData,
                  id_type: selectedTypeId,
                  type_name: selectedType?.type_name || "",
                });
              }}
            >
              {types.map((type) => (
                <MenuItem key={type.id_type} value={type.id_type}>
                  {type.type_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="date"
              name="date"
              label="Data"
              type="date"
              required={true}
              value={formatDateForInput(formData.date)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  date: new Date(e.target.value),
                });
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="value"
              name="value"
              label="Wartość"
              type="number"
              required={true}
              value={formData.value}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  value: Number(e.target.value),
                });
              }}
              InputProps={{
                inputProps: {
                  step: "0.01",
                },
              }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Kategoria</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              required={true}
              value={formData.id_category}
              onChange={(e: SelectChangeEvent<string>) => {
                const selectedCategoryId = e.target.value;
                const selectedCategory = categories.find(
                  (category) => category.id_category === selectedCategoryId
                );
                setFormData({
                  ...formData,
                  id_category: e.target.value,
                  category_name: selectedCategory?.category_name || "",
                });
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.id_category}
                  value={category.id_category}
                >
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="comment"
              name="comment"
              label="Komentarz"
              // contentEditable={true}
              multiline
              rows={4}
              value={formData.comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormData({
                  ...formData,
                  comment: e.target.value,
                });
              }}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onSubmit={(e) => {
              handleClickSubmit(e, formData);
            }}
          >
            {isEditMode ? "Aktualizuj rekord" : "Dodaj nowy rekord"}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FormBalaceRecord;
