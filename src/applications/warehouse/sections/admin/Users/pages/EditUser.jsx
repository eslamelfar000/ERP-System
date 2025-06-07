import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select, message } from "antd";
import { getUserById, updateUser } from "../../../../../../apis/users";
import { getRoles } from "../../../../../../apis/roles";
const { Option } = Select;

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await getRoles();
      console.log(res.data);

      setRoles(res.data);
    };
    fetchRoles();
    const fetchUser = async () => {
      const res = await getUserById(id);
      console.log(res.data);
      setData(res.data);
    };
    fetchUser();
  }, []);

  const onFinish = async (values) => {
    const formData = {
      name: values.name,
      role: selectedRole,
      permissions: selectedRolePermissions,
    };
    console.log(formData);
    const res = await updateUser(formData, id);
    if (res instanceof Error)
      Object.keys(res.response.data.error.errors).map((key) =>
        message.error(res.response.data.error.errors[key])
      );
    else {
      message.success("تم تعديل مستخدم بنجاح");
      navigate(`/warehouse/users/show-users`);
    }
  };

  const handleRoleSelect = (value) => {
    const selectedRole = roles?.find((role) => role.name === value);
    setSelectedRole(selectedRole?.id);
    setSelectedRolePermissions(selectedRole?.permissions);
  };

  const handleAddRoleClick = () => {
    navigate("/warehouse/roles/add-role");
  };

  return (
    <div className="form-container">
      <h1 className="form-title" style={{ marginBottom: "20px" }}>
        عدل مستخدم
      </h1>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={data}
      >
        <Form.Item
          label="الدور"
          name="role"
          rules={[{ required: true, message: "من فضلك إختر دور" }]}
          style={{ marginBottom: "20px" }}
        >
          <Select
            placeholder="إختر دور"
            onChange={handleRoleSelect}
            style={{ width: "100%" }}
          >
            {roles?.map((role) => (
              <Option key={role.id} value={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedRolePermissions?.length > 0 && (
          <Form.Item label="صلاحيات الدور" style={{ marginBottom: "20px" }}>
            <Select
              mode="multiple"
              placeholder="Role permissions"
              value={selectedRolePermissions.map(
                (permission) => permission.name
              )}
              disabled
              style={{ width: "100%" }}
            >
              {selectedRolePermissions.map((permission) => (
                <Option key={permission} value={permission}>
                  {permission}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <div>
          <span>لم تعثر على دور؟</span>
          <Button style={{ marginLeft: "10px" }} onClick={handleAddRoleClick}>
            أضف هنا
          </Button>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            عدل مستخدم
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUser;
