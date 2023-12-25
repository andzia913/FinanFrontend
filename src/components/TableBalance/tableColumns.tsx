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
    Cell: ({ row }) => (
      <span>{new Date(row.original.date).toLocaleDateString()}</span>
    ),
  },
  {
    Header: "Wartość",
    accessor: "value",
    sortable: true,
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
