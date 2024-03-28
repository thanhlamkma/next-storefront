import { Table as AntTable, TableProps as AntTableProps } from "antd";
import { ColumnProps } from "antd/lib/table";
import { ColumnGroupProps } from "antd/lib/table/ColumnGroup";
import { useMemo } from "react";

export type TableProps<RecordType> = AntTableProps<RecordType> & {
  headerWhite?: boolean;
  withBorder?: boolean;
  striped?: boolean;
};

interface Table<RecordType> {
  (props: TableProps<RecordType>): JSX.Element;

  Column: ColumnProps<RecordType>;
  ColumnGroup: ColumnGroupProps<RecordType>;
}

function Table<RecordType extends object = any>({
  headerWhite,
  striped,
  ...props
}: TableProps<RecordType>) {
  const className = useMemo(() => {
    let className = props.className ? props.className : "";

    if (headerWhite) {
      className += " header-white";
    }

    if (striped) {
      className += " striped";
    }
    return className;
  }, [headerWhite, props.className, striped]);

  return <AntTable {...props} className={className} />;
}

Table.Column = AntTable.Column;
Table.ColumnGroup = AntTable.ColumnGroup;

export default Table;
