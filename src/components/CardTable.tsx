import { Card } from "antd";
import { CardProps } from "antd/lib/card";
import Table, { TableProps } from "antd/lib/table";
import React from "react";

type CardTableProps<RecordType> = {
  tableProps?: TableProps<RecordType>;
  cardProps?: CardProps;
  children?: React.ReactNode;
};

const { Column, ColumnGroup } = Table;

function CardTable<RecordType extends object = any>({
  cardProps,
  tableProps,
  children,
}: CardTableProps<RecordType>) {
  return (
    <Card
      {...cardProps}
      headStyle={{ marginTop: "-16px" }}
      bodyStyle={{ padding: 0 }}
    >
      <Table {...tableProps}>{children}</Table>
    </Card>
  );
}

CardTable.Column = Column;
CardTable.ColumnGroup = ColumnGroup;

export default CardTable;
