import React, { useState, useEffect } from "react";

import TotalAmount from "../../../../../../../components/shared/totalAmount/TotalAmount";

// import "./CashierWarehouseRequests.scss";
import axios from "axios";
import { getSuppliers } from "../../../../../../../apis/suppliers";
import { getAllDepartments } from "../../../../../../../apis/departments";

import { API_ENDPOINT } from "../../../../../../../../config";
import { useNavigate, useParams } from "react-router-dom";
import CahierWearhouseDetailes from "../../../../../../../components/shared/CashierWearhouseDetailes/CashierWearhouseDetailes";
import ItemCashierWearhouse from "../../../../../../../components/shared/CashierWearhouseDetailes/ItemCashierWearhouse";
import { message } from "antd";
import { getProductsById } from "../../../../../../../apis/product";

const AddProductRecipe = () => {
  // const [suppliers, setSuppliers] = useState([]);
  // const [department, setDepartment] = useState([]);
  const Token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [data, setData] = useState(); // Initialize data as null

  const [parentName, setParentName] = useState("");
  // const [recipeUnit, setRecipeUnit] = useState('')
  const [ProductParentId, setRecipeParentId] = useState("");
  const [ProductCategory_id, setProductCategoryId] = useState("");

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

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeData = await getProductsById(id);
        console.log("================>" + recipeData.data);
        setData(recipeData.data);
        setParentName(recipeData.data.name);
        // setRecipeUnit(recipeData.data.unit)
        setRecipeParentId(recipeData.data.sub_category_id);
        setProductCategoryId(recipeData.data.category_id);

        console.log("================>" + recipeData.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  // console.log(data.sub_category_id)
  const handleDownloadPDF = async () => {
    const formData = new FormData();
    formData.append("product_id", id);
    items.forEach((item, index) => {
      formData.append(`recipes[${index}][recipe_id]`, item.recipeId);
      formData.append(`recipes[${index}][quantity]`, item.quantity);
      // formData.append(`recipes[${index}][expire_date]`, item.expireDate);
    });

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/v1/store/products/recipts/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      console.log(response.data);
      navigate(
        `/warehouse/returants/subcategory/show-product/${data.sub_category_id}`
      );
      // console.log("Invoice created successfully!");
      message.success("تم اضافة المكون بنجاح");
      // Optionally, you can redirect or show a success message here
    } catch (error) {
      console.error("Error creating invoice:", error);
      // Handle error condition, show error message, etc.
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">اضافة مكون الى المنتج</h1>
      <div>
        <label className="form-label">المنتج :</label>
        <input
          className="form-input"
          type="textarea"
          value={parentName}
          disabled={true}
          style={{ cursor: "not-allowed" }}
        />
      </div>

      <CahierWearhouseDetailes
        onAddItem={handleAddItem}
        selectedSupplier={selectedSupplier}
        // InvoiceType={lastItem}
      />
      <ItemCashierWearhouse items={items} onDeleteItem={handleDeleteItem} />
      <TotalAmount total={calculateTotalAmount()} />
      <button className="form-btn" onClick={handleDownloadPDF}>
        حفظ البيانات
      </button>
    </div>
  );
};

export default AddProductRecipe;
