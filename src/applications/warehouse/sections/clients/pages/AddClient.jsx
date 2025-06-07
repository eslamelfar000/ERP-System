import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientTypes } from "../../../../../apis/clients/ClientType";
import { addClient } from "../../../../../apis/clients/Client";
import DynamicForm from "../../../../../components/shared/form/Form";

const AddClient = () => {
  const navigate = useNavigate();
  const [clientTypes, setClientTypes] = useState([]);
  useEffect(() => {
    const fetchClientTypes = async () => {
      const res = await getClientTypes({}, "", () => { });
      setClientTypes(res?.data);
      console.log(res?.data);
    };
    fetchClientTypes();
  }, []);
  const handleSubmit = async (formData) => {
    console.log(formData);
    await addClient(formData);
    navigate(`/warehouse/clients/client`);
  };

  const fields = [
    {
      type: "text",
      name: "name",
      labelName: "الاسم العميل",
      placeholder: "يجب عليك ادخال إسم العميل",
      required: true,
    },
    {
      type: "number",
      name: "phone",
      labelName: "رقم التيليفون",
      placeholder: "يجب عليك ادخال رقم العميل",
      required: true,
    },
    {
      type: "number",
      name: "military_number",
      labelName: "رقم العسكرى",
      placeholder: "ادخل الرقم العسكرى",
    },
    {
      type: "select",
      name: "is_worker",
      placeholder: "النوع",
      labelName: " النوع",
      options: [
        { value: 1, label: "عامل بالدار" },
        { value: 0, label: "غير عامل بالدار" },
      ],
    },
    {
      type: "number",
      name: "salary",
      labelName: "المرتب",
      placeholder: "ادخل المرتب",
    },
    {
      type: "number",
      name: "incentives",
      labelName: "الحوافز",
      placeholder: "ادخل الحوافز",
    },
    {
      type: "select",
      name: "client_type_id",
      labelName: "نوع العميل",
      placeholder: "نوع العميل",
      options: clientTypes.map((type) => {
        return { value: type.id, label: type.name };
      }),
    },
  ];
  return (
    <div className="form-container">
      <h1 className="form-title">إضافة عميل جديد</h1>
      <DynamicForm fields={fields} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddClient;
