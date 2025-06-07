import React, { useState, useEffect } from "react";

import TotalAmount from "../../../../../../components/shared/totalAmount/TotalAmount";

import "./AddCashierOrder.scss";
import axios from "axios";
import { API_ENDPOINT } from "../../../../../../../config";
import CashierOrderDetailes from "../../../../../../components/shared/CashierOrderDetails/CashierOrderDetailes";
import CashierItemList from "../../../../../../components/shared/CashierItemList/CashierItemList";
import { message, Select } from "antd";
import { useAuth } from "../../../../../../context/AuthContext";
import { checkTableNumber } from "../../../../../../apis/orders";
const AddCashierOrder = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [discountReasons, setDiscountReasons] = useState([]);
  const [errors, setErrors] = useState({});

  const [clientTypes, setClientTypes] = useState([]);
  const [selectedClientTypeId, setSelectedClientTypeId] = useState(null);
  const [clients, setClients] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [newUserValues, setNewUserValues] = useState({
    deleviery_type: "kitchen",
    name: "",
    phone: "",
    military_number: "",
    client_type_id: "",
    discount_reason_id: "",
    payment_method_id: "",
    table_number: "",
    comment: "",
    client_id: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      await fetchClients();
      await fetchPaymentMethods();
    };
    fetchData();
  }, [selectedClientTypeId]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchClientTypes();
      await fetchDiscountReasons();
    };
    fetchData();
  }, []);
  const validateTableNumber = (value) => {
    if (value <= 0 || !value) {
      return "رقم التربيزة يجب أن يكون أكبر من صفر";
    }
    return "";
  };

  const validateCustomerName = (value) => {
    if (!value.trim()) {
      return "يجب أن تدخل اسم العميل";
    }
    return "";
  };

  const validateDiscount = (value) => {
    if (value < 0) {
      return "نسبة الخصم يجب أن تكون أكبر من أو تساوي صفر";
    }
    return "";
  };

  const validateDiscountReason = (value) => {
    if (!value) {
      return "يجب أن تدخل سبب الخصم";
    }
    return "";
  };

  const validateSelection = (value) => {
    if (!value && newUserValues["client_id"] !== "") {
      return "يجب اختيار قيمة";
    }

    return "";
  };
  const validateUser = () => {
    if (newUserValues["client_id"] === "add-new") {
      if (
        !newUserValues["name"] ||
        !newUserValues["phone"] ||
        !newUserValues["military_number"] ||
        !newUserValues["client_type_id"] ||
        !newUserValues["discount_reason_id"] ||
        !newUserValues["payment_method_id"]
      )
        return "يجب اختيار قيم للمستخدم الجديد";
    } else {
      return "";
    }
  };

  const validateForm = () => {
    const errors = {};
    errors.userError = validateUser();
    errors.tableNumber = validateTableNumber(newUserValues["table_number"]);
    errors.discountReason = validateDiscountReason(
      newUserValues["discount_reason_id"]
    );
    errors.selectedClient = validateSelection(newUserValues["client_id"]);
    errors.clientType = validateSelection(newUserValues["client_type_id"]);
    errors.deliveryType = validateSelection(newUserValues["deleviery_type"]);
    errors.paymentMethod = validateSelection(
      newUserValues["payment_method_id"]
    );
    setErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };
  const fields = [
    {
      label: "نوع العميل",
      type: "select",
      placeholder: "اختر  نوع العميل ",
      options:
        clientTypes?.map((category) => ({
          value: category.id,
          label: category.name,
        })) || [],
      required: true,
      onChange: async (value) => {
        setSelectedClientTypeId(value);
      },
      error: errors.clientType,
    },
    {
      label: " العميل",
      type: "select",
      placeholder: "اختر العميل",
      options:
        clients?.map((category) => ({
          value: category.id,
          label: category.name,
        })) || [],
      required: true,
      onChange: async (value) => {
        handleNewUserFormChange("client_id", value);
      },
      canAdd: true,
      error: errors.selectedClient,
    },
    {
      label: "طرق الدفع",
      type: "select",
      placeholder: "اختر طريقة دفع ",
      options:
        paymentMethods?.map((category) => ({
          value: category.id,
          label: category.name,
        })) || [],
      required: true,
      onChange: (value) => handleNewUserFormChange("payment_method_id", value),
      error: errors.paymentMethod,
    },
  ];
  const handleNewUserFormChange = (key, value) => {
    console.log(newUserValues, key, value);
    setNewUserValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const fetchClientTypes = async () => {
    console.log("smd");
    try {
      const Token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINT}/api/v1/orders/clients/type`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      setClientTypes(data.data);
    } catch (error) {
      console.error("Error fetching Product categories:", error);
    }
  };
  const fetchClients = async () => {
    try {
      const Token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINT}/api/v1/orders/clients/${selectedClientTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      handleNewUserFormChange("client_type_id", selectedClientTypeId);
      setClients(data.data);
    } catch (error) {
      console.error("Error fetching Product categories:", error);
    }
  };
  const fetchDiscountReasons = async () => {
    try {
      const Token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINT}/api/v1/orders/discount/reasons`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      setDiscountReasons(data.data);
    } catch (error) {
      console.error("Error fetching Product categories:", error);
    }
  };
  const fetchPaymentMethods = async () => {
    try {
      const Token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINT}/api/v1/orders/payment/method/${selectedClientTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      setPaymentMethods(data.data);
    } catch (error) {
      console.error("Error fetching Product categories:", error);
    }
  };

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleSubmit = async () => {
    const resMessage = await checkTableNumber(newUserValues["table_number"]);
    console.log(resMessage);
    if (resMessage === false) {
      message.error("هذه الترابيزة مشغولة");
      return;
    }
    if (!validateForm()) return;
    const formData = new FormData();

    items.forEach((item, index) => {
      formData.append(`products[${index}][product_id]`, item.ProductId);
      formData.append(`products[${index}][product_type]`, item.productType);
      formData.append(`products[${index}][quantity]`, item.quantity);
    });
    const date = new Date();
    const datetype = new Date(date.toLocaleString()); // Assuming this is your date string
    const year = datetype.getFullYear();
    const month = String(datetype.getMonth() + 1).padStart(2, "0");
    const day = String(datetype.getDate()).padStart(2, "0");
    const hours = String(datetype.getHours()).padStart(2, "0");
    const minutes = String(datetype.getMinutes()).padStart(2, "0");
    const seconds = String(datetype.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    formData.append("order_date", formattedDate);

    formData.append("discount_reason_id", newUserValues["discount_reason_id"]);
    formData.append("table_number", newUserValues["table_number"]);
    formData.append("comment", newUserValues["comment"]);
    formData.append("deleviery_type", newUserValues["deleviery_type"]);
    formData.append("payment_method_id", newUserValues["payment_method_id"]);
    formData.append(
      "client_id",
      newUserValues["client_id"] === "add-new" ? "" : newUserValues["client_id"]
    );
    formData.append("client_type_id", newUserValues["client_type_id"]);
    formData.append("military_number", newUserValues["military_number"]);
    formData.append("department_id", user?.department.id);
    formData.append("name", newUserValues["name"]);
    formData.append("phone", newUserValues["phone"]);
    formData.append("tax", 0);

    try {
      const Token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_ENDPOINT}/api/v1/orders/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-cashier-data",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      console.log(response.data);
      message.success("لقد تم اضافة الاوردر بنجاح");
    } catch (error) {
      console.error("Error creating invoice:", error);
      message.error("حدث خطأ");
    }
  };

  return (
    <div className="form-cashier-container">
      <h1 className="form-cashier-title">فاتورة الكاشير</h1>
      <div className="form-cashier-product-category-parent">
        <div className="form-cashier-product-category">
          {fields.map((field, index) => (
            <div key={index} className="form-cashier-select-wrraper">
              <label className="form-cashier-label">{field.label}</label>
              <Select
                showSearch
                className="form-cashier-select"
                placeholder={field.placeholder}
                onChange={(value) => field.onChange(value)}
                filterOption={(input, option) => {
                  console.log(option, input);
                  return (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                optionFilterProp="children"
                disabled={field.options.length === 0}
              >
                {field.options.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              {field.canAdd && (
                <button
                  className="form-cashier-btn"
                  onClick={() => setAddFormVisible(!addFormVisible)}
                  style={{
                    width: "100%",
                    // backgroundColor: "lightgray",
                    // color: "black",
                  }}
                >
                  أضف جديد
                </button>
              )}
              {field.error && (
                <span className="error cashier-input-error">{field.error}</span>
              )}
            </div>
          ))}
        </div>
        {addFormVisible && (
          <div className="form-cashier-details-parent">
            <div>
              <label className="form-cashier-label">الإسم :</label>
              <input
                className="form-cashier-input"
                type="text"
                value={newUserValues["name"]}
                onChange={(e) =>
                  handleNewUserFormChange("name", e.target.value)
                }
              />
            </div>
            <div>
              <label className="form-cashier-label"> رقم الموبايل:</label>
              <input
                className="form-cashier-input"
                type="number"
                value={newUserValues["phone"]}
                onChange={(e) =>
                  handleNewUserFormChange("phone", e.target.value)
                }
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
            <div>
              <label className="form-cashier-label"> الرقم العسكرى:</label>
              <input
                className="form-cashier-input"
                type="number"
                value={newUserValues["military_number"]}
                onChange={(e) =>
                  handleNewUserFormChange("military_number", e.target.value)
                }
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
            <div>
              <label className="form-cashier-label">سبب الخصم:</label>

              <select
                className="form-cashier-input"
                value={newUserValues["discount_reason_id"]}
                onChange={(e) =>
                  handleNewUserFormChange("discount_reason_id", e.target.value)
                }
                onWheel={(event) => event.currentTarget.blur()}
              >
                <option key={0} value={""}></option>
                {discountReasons.map((select) => (
                  <option key={select.id} value={select.id}>
                    {select.discount_name}
                  </option>
                ))}
              </select>
              {errors.discountReason && (
                <span className="error cashier-input-error">
                  {errors.discountReason}
                </span>
              )}
            </div>
            {errors.userError && (
              <span className="error cashier-input-error">
                {errors.userError}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="form-cashier-details-parent">
        <div>
          <label className="form-cashier-label">اسم الكاشير:</label>
          <input
            className="form-cashier-input"
            type="text"
            disabled={true}
            style={{ cursor: "not-allowed" }}
            value={user?.name}
          />
        </div>
        <div>
          <label className="form-cashier-label"> رقم التربيزة:</label>
          <input
            className="form-cashier-input"
            type="number"
            min={0}
            value={newUserValues["table_number"]}
            onChange={(e) =>
              handleNewUserFormChange("table_number", e.target.value)
            }
            onWheel={(event) => event.currentTarget.blur()}
          />
          {errors.tableNumber && (
            <span className="error cashier-input-error ">
              {errors.tableNumber}
            </span>
          )}
        </div>

        <div>
          <label className="form-cashier-label">سبب الخصم:</label>

          <select
            className="form-cashier-input"
            value={newUserValues["discount_reason_id"]}
            onChange={(e) =>
              handleNewUserFormChange("discount_reason_id", e.target.value)
            }
            onWheel={(event) => event.currentTarget.blur()}
          >
            <option key={0} value={""}>
              {""}
            </option>
            {discountReasons.map((select) => (
              <option key={select.id} value={select.id}>
                {select.discount_name}
              </option>
            ))}
            {errors.discount && (
              <span className="error cashier-input-error">
                {errors.discount}
              </span>
            )}
          </select>
          {errors.discountReason && (
            <span className="error cashier-input-error">
              {errors.discountReason}
            </span>
          )}
        </div>

        <div>
          <label className="form-cashier-label">ملاحظة : </label>
          <textarea
            className="form-cashier-txt-area"
            onChange={(e) => handleNewUserFormChange("comment", e.target.value)}
          ></textarea>
        </div>
      </div>
      <CashierOrderDetailes onAddItem={handleAddItem} />
      <CashierItemList items={items} onDeleteItem={handleDeleteItem} />
      <TotalAmount total={calculateTotalAmount()} />
      <button className="form-cashier-btn" onClick={handleSubmit}>
        حفظ البيانات
      </button>
    </div>
  );
};

export default AddCashierOrder;
