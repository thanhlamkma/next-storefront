import { Form } from "antd";
import { Rule } from "antd/lib/form";
import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList";
import { ColumnType as AntColumn } from "antd/lib/table";
import React, { ComponentType } from "react";
import Table, { TableProps } from "src/components/Table";
import EditableCell from "src/components/TableFormList/components/EditableCell";
import env from "src/core/env";

// Table
export interface ColumnType
  extends Omit<AntColumn<FormListFieldData>, "render"> {
  editable?: boolean;
  dataIndex?: string;
  toggleEdit?: boolean;
  label?: string;
  rules?: Rule[];
  customInput?: React.ReactElement;
  render?: (
    value: any,
    record: FormListFieldData,
    index: number,
    operators: FormListOperation
  ) => React.ReactNode;
}

export interface ColumnGroupType extends ColumnType {
  children: ColumnsType;
}

export type ColumnsType = (ColumnGroupType | ColumnType)[];

type EditableTableProps = Omit<
  TableProps<FormListFieldData>,
  "dataSource" | "children" | "columns" | "footer"
> & {
  name: string;
  columns: ColumnsType;
  header?: ComponentType<FormListOperation>;
  footer?: ComponentType<FormListOperation>;
  toggleEdit?: boolean;
  initialValue?: any[];
};

class TableFormList extends React.Component<
  EditableTableProps,
  { page: number; pageSize: number }
> {
  constructor(props: EditableTableProps) {
    super(props);

    this.state = {
      page: 1,
      pageSize: env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
    };
  }

  handlePageChange = (page: number) => {
    this.setState({ page });
  };

  render() {
    const {
      footer: Footer,
      header: Header,
      toggleEdit,
      name,
      initialValue,
      ...tableProps
    } = this.props;
    const { page, pageSize } = this.state;

    return (
      <Form.List name={name} initialValue={initialValue}>
        {(fields, operators) => {
          return (
            <>
              {Header && (
                <div className="mb-3">
                  <Header {...operators} />
                </div>
              )}
              <Table<FormListFieldData>
                {...tableProps}
                dataSource={fields}
                pagination={{
                  pageSize,
                  onChange: this.handlePageChange,
                  size: "small",
                  position: ["bottomLeft"],
                }}
                columns={this.props.columns.map((col) => {
                  return {
                    ...col,
                    render: (value: any, record: FormListFieldData, index) => {
                      if (col.render) {
                        return col.render(
                          value,
                          record,
                          (page - 1) * pageSize + index,
                          operators
                        );
                      }

                      return (
                        <EditableCell
                          label={col.label}
                          record={record}
                          listName={name}
                          dataIndex={col.dataIndex ? col.dataIndex : ""}
                          editable={
                            typeof col.editable === "undefined"
                              ? false
                              : col.editable
                          }
                          customInput={col.customInput}
                          toggleEdit={
                            typeof col.toggleEdit !== "undefined"
                              ? col.toggleEdit
                              : typeof toggleEdit !== "undefined"
                              ? toggleEdit
                              : true
                          }
                          rules={col.rules}
                        />
                      );
                    },
                  };
                })}
              />
              {Footer && (
                <div className="mt-3">
                  <Footer {...operators} />
                </div>
              )}
            </>
          );
        }}
      </Form.List>
    );
  }
}

export default TableFormList;
