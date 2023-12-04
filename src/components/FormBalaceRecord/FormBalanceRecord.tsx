import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { CategoryEntity } from 'types/category.entity';
import { TypeEntity } from 'types/type.entity';
import formatDateForInput from '../../utils/formatDateForInput';
import { BalanceEntity } from 'types/balance.entity';

interface FormData extends BalanceEntity {
  id_type: string;
  date: Date;
  value: number;
  id_category: string;
  comment: string; 
};


const FormBalaceRecord = ({categories, types, recordToEdit}: {categories: CategoryEntity[], types: TypeEntity[], recordToEdit: BalanceEntity | null} ) => {


  const initialFormData: FormData = {
    id_type: types[0].id_type,
    type_name: types[0].type_name,
    date: new Date(),
    value: 0,
    id_category: String(categories[0].id_category), 
    category_name: categories[0].category_name,
    comment: '',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [recordToEdit, setRecordToEdit] = useState(null);
  useEffect(() => {
    if (recordToEdit) {
      console.log('istnieje record do edycji- tablebalance', recordToEdit)
      setIsEditMode(true)
      setFormData({
        id_type: recordToEdit.id_type,
        type_name: recordToEdit.type_name,
        date: recordToEdit.date,
        value: recordToEdit.value,
        id_category: recordToEdit.id_category,
        category_name: recordToEdit.category_name,
        comment: recordToEdit.comment,
      });
    }
  }, [recordToEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try{
      const response = await fetch('http://localhost:5000/financialBalance/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
       if (response.ok) {
      const responseData = await response.json();
      console.log('Dane zostały pomyślnie wysłane na serwer.', responseData);
      setFormData(initialFormData);
    } else {
      console.error('Błąd podczas wysyłania danych na serwer.');}
     } catch (error) {
      console.error('Błąd podczas wysyłania danych na serwer.', error)
    setFormData(initialFormData);
  }};

  return (
    <Grid container justifyContent="center">
      <Grid item xs={10} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          
          <form onSubmit={handleSubmit}>
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
                  const selectedType = types.find((type) => type.id_type === selectedTypeId);
              
                  setFormData({
                    ...formData,
                    id_type: selectedTypeId,
                    type_name: selectedType?.type_name || ''
                  });
                }}
              >
                {types.map((type) => <MenuItem key={type.id_type} value = {type.id_type}>
                  {type.type_name}
                </MenuItem>) }
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
                  });}}
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
                    value: Number(e.target.value)
                  })
                }}
                InputProps={{
                  inputProps: {
                    step: '0.01',
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
                onChange={ (e: SelectChangeEvent<string>) => {
                  setFormData({
                    ...formData,
                    id_category: e.target.value,
                })}}
              >
                {categories.map((category) => ( <MenuItem key={category.id_category} value={category.id_category}>
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>{
                  setFormData({
                    ...formData,
                    comment: e.target.value
                })
                }}
              />
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Dodaj Rekord
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default FormBalaceRecord;
