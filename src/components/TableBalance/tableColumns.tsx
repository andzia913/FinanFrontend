import TableColumn from "../../types/tableColumn";
export const tableColumns: TableColumn[] = [
  {
    Header: "Typ",
    accessor: "type_name",
    sortable: true,
  },
  {
    Header: "Data",
    accessor: "date",
    sortable: true,
    Cell: ({ row }) => <>{new Date(row.original.date).toLocaleDateString()}</>,
  },
  {
    Header: "Wartość",
    accessor: "value",
    sortable: true,
    Cell: ({ row }) => <>{row.original.value.toFixed(2)}</>,
  },
  {
    Header: "Kategoria",
    accessor: "category_name",
    sortable: true,
  },
  {
    Header: "Komentarz",
    accessor: "comment",
    sortable: true,
  },
  // {
  //   Header: "Planowany",
  //   accessor: "planned",
  //   sortable: true,
  //   show: false,
  // },
];
