import React from 'react';
import TableColumn from 'types/tableColumn';
import { BalanceEntity } from 'types/balance.entity';
import { useTable, Column } from 'react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TableBalance = ({ columns, data, handleEditClick }: { columns: TableColumn[]; data: BalanceEntity[], handleEditClick: Function}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: columns as Column[],
        data,
    });

    // const onEditClick = async (id: string) => {
    //     // try{  ON MA PRZEKAZAĆ CAŁY OBIEKT A NIE TYLKO ID 
    //     //     const response = await fetch(`http://localhost:5000/financialBalance/update/${id}`, {
    //     //         method: 'UPDATE',
    //     //         headers: {
    //     //              'Content-Type': 'application/json'
    //     //          },
    //     //        })
    //     //     if (response.ok) {
    //     //     const responseData = response;
    //     //     console.log('Dane zostały pomyślnie usunięte.', responseData);
    //     //       } else {
    //     //     console.error('Błąd podczas wysyłania danych na serwer. UPDATE');}
    //     //    } catch (error) {
    //     //     console.error('Błąd podczas wysyłania danych na serwer. UPDATE', error)
    //     //     }
    // };
      
    const onDeleteClick = async (id: string) => {
        try{
           const response = await fetch(`http://localhost:5000/financialBalance/delete/${id}`, {
               method: 'DELETE',
               headers: {
                    'Content-Type': 'application/json'
                },
              })
       if (response.ok) {
     const responseData = response;
     console.log('Dane zostały pomyślnie usunięte.', responseData);
       } else {
     console.error('Błąd podczas wysyłania danych na serwer. DELETE');}
    } catch (error) {
     console.error('Błąd podczas wysyłania danych na serwer. DELETE', error)
     }};

    return (
        <TableContainer component={Paper}>
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    );
                                })}
                                <TableCell>
                                    <IconButton aria-label="Edit"  onClick={() => handleEditClick(row.original.id)} >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="Delete" onClick={() => onDeleteClick(row.original.id)} >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
                }

export default TableBalance;
