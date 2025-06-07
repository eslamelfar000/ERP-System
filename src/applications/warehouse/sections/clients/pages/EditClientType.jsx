import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClientTypeById,
  updateClientType,
} from "../../../../../apis/clients/ClientType";
import { Form, Input, Button, Select } from "antd";
import { getPaymentMethods } from "../../../../../apis/clients/PaymentMethod";
const { Option } = Select;

const EditClientType = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeData = await getClientTypeById(id);
        setData(recipeData?.data);
        console.log(recipeData.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
    const fetchMethods = async () => {
      try {
        const recipeData = await getPaymentMethods({}, "", () => {});
        setPaymentMethods(recipeData?.data);
        console.log(recipeData.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchMethods();
  }, [id]);

  const onFinish = async (values) => {
    console.log(values);
    const formData = {
      name: values.name,
      methods: selectedPaymentMethods,
      newClient: values.newClient,
    };
    console.log(formData);
    await updateClientType(id, formData);
    navigate(`/warehouse/clients/client-type`);
  };

  const handlePermissionSelect = (values, options) => {
    console.log(values);
    const methods = values.map((value) =>
      paymentMethods.find((method) => {
        return method.label === value;
      })
    );
    console.log(methods);
    setSelectedPaymentMethods(methods);
  };

  // const validatePermissions = (_, value) => {
  //   if (!value || value.length === 0) {
  //     return Promise.reject(new Error("يرجى اختيار صلاحية واحدة على الأقل!"));
  //   }
  //   return Promise.resolve();
  // };

  return (
    <div className="form-container">
      <h1 className="form-title" style={{ marginBottom: "20px" }}>
        تعديل نوع عميل
      </h1>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="إسم نوع العميل"
          name="name"
          rules={[{ required: true, message: "من فضلك أضف إسم" }]}
          style={{ marginBottom: "20px" }}
        >
          <Input placeholder="أضف إسم لنوع العميل" />
        </Form.Item>
        <Form.Item label="طرق الدفع" style={{ marginBottom: "20px" }}>
          <Select
            mode="multiple"
            placeholder="اختر طرق الدفع"
            onChange={handlePermissionSelect}
            style={{ width: "100%" }}
            initialValue={[]}
          >
            {paymentMethods?.map((method, index) => (
              <Option key={method.label}>{method.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="عميل"
          name="newClient"
          style={{ marginBottom: "20px" }}
          initialValue={1}
        >
          <Select placeholder="اختر النوع" style={{ width: "100%" }}>
            <Option key={1} value={0}>
              عميل قديم
            </Option>
            <Option key={2} value={1}>
              عميل جديد
            </Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            أضف
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditClientType;
