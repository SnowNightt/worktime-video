interface TableColumn {
  type?: "index" | "selection" | "expand";
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  fixed?: boolean | "left" | "right";
}
export interface TableConfigType<T> {
  tableData: T;
  columns: TableColumn[];
}
