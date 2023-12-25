import { Row } from "react-table";

export type TableColumn = {
  Header: string;
  accessor: string;
  sortable: boolean;
  Cell?: (props: { row: Row }) => JSX.Element;
  show?: boolean;
};

export default TableColumn;
