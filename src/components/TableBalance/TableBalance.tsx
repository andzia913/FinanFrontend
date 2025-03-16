import TableColumn from "types/tableColumn";
import { BalanceEntity } from "types/balance.entity";
import { useTable, Column } from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import serverAddress from "../../utils/server";

const TableBalance = ({
  columns,
  data,
  handleEditClick,
  handleDeleteClick
}: {
  columns: TableColumn[];
  data: BalanceEntity[];
  handleEditClick: Function;
  handleDeleteClick: Function;
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: columns as Column<BalanceEntity>[],
      data,
    });

  const onDeleteClick = async (id?: number) => {
    try {
      const response = await fetch(
        serverAddress + `/financialBalance/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      if (response.ok) {
        //const responseData = response;
        handleDeleteClick();
      } else {
        console.error("Błąd podczas wysyłania danych na serwer. DELETE");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych na serwer. DELETE", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                 <TableCell>
                   {row.original.type.name}
                 </TableCell>
                <TableCell>
                  {row.original.date ? new Date(row.original.date).toISOString() : "Brak daty"}
                </TableCell>
                <TableCell>
                  {row.original.value}
                </TableCell>
                <TableCell>
                  {row.original.category.name}
                </TableCell>
                <TableCell>
                  {row.original.comment}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edytuj">
                    <IconButton
                      aria-label="Edit"
                      onClick={() => handleEditClick(row.original.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Usuń">
                    <IconButton
                      aria-label="Delete"
                      onClick={() => onDeleteClick(row.original.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableBalance;
