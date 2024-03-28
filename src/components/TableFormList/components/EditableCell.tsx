import { Form, Input } from "antd";
import { Rule } from "antd/lib/form";
import { FormListFieldData } from "antd/lib/form/FormList";
import { useState } from "react";

interface EditableCellProps<RecordType extends object> {
  editable: boolean;
  toggleEdit: boolean;
  listName: string;
  dataIndex: string;
  record: RecordType;
  rules?: Rule[];
  label?: string;
  customInput?: React.ReactElement;
}

export default function EditableCell({
  editable,
  dataIndex,
  listName,
  toggleEdit: canToggleEdit,
  record,
  rules,
  label,
  customInput,
}: EditableCellProps<FormListFieldData>) {
  const [editing, setEditing] = useState(!canToggleEdit);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <Form.Item
      {...record}
      label={label}
      labelCol={{ span: 0 }}
      style={{ margin: 0 }}
    >
      <Form.Item
        name={[record.name, dataIndex]}
        rules={rules}
        hidden={!editable || !editing}
        noStyle
      >
        {customInput || <Input />}
      </Form.Item>
      {(!editable || !editing) && (
        <Form.Item noStyle shouldUpdate>
          {(form) => (
            <div
              className="editable-cell-value-wrap"
              style={{ padding: "5px 12px", cursor: "pointer" }}
              onClick={canToggleEdit ? toggleEdit : undefined}
            >
              {form.getFieldValue([listName, record.name, dataIndex])}
            </div>
          )}
        </Form.Item>
      )}
    </Form.Item>
  );
}
