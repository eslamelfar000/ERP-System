import React, { useEffect, useState } from "react";
import "./InvoiceCategory.scss";
import Button from "./Button/Button";
import {
  getIncomingInvoiceByType,
  getOutgoingInvoiceByType,
  getReturndInvoiceByType,
  getInvoiceById,
  updateInvoice,
  changeInvoiceStatus,
  updateInvoiceQuintity,
} from "../../../../../apis/invoices";
import Table from "../../../../../components/shared/table/Table";
import { getSuppliers } from "../../../../../apis/suppliers";
import { useAuth } from "../../../../../context/AuthContext";
import { getAllDeaprtments } from "../../../../../apis/department";
function Categories(props) {
  const [selectedCategory, setSelectedCategory] = useState("inComing"); // Default selected category is "الوارد"
  const [supplier, setAllSupplier] = useState([]);
  const [departments, setDepartments] = useState([]);

  const { user } = useAuth();
  useEffect(() => {
    const fetchSupplier = async () => {
      const res = await getSuppliers({}, "", () => { });
      setAllSupplier(
        [{ label: "", value: "" }].concat(
          res.data.map((item) => {
            return { label: item.name, value: item.id };
          })
        )
      );
      console.log(departments);
    };

    fetchSupplier();
    const fetchDepartments = async () => {
      const res = await getAllDeaprtments();
      setDepartments(res.data);
    };
    fetchDepartments();
  }, []);
  const statusOptions = [
    { value: "", label: "" },
    { value: "approved", label: "تم المراجعة" },
    { value: "pending", label: "تحت المراجعة" },
    { value: "rejected", label: "مرفوضة" },
  ];
  const tableHeaders = [
    { key: "code", value: "  كود الفاتوره" },
    { key: "invoice_date", value: "تاريخ الإصدار" },
    { key: "registration_date", value: "تاريخ التسجيل" },
    { key: "status", value: "الحالة" },
  ];
  const detailsHeaders = [
    {
      key: "recipes",
      label: "المواد الخام",
      isArray: true,
      isInput: true,
      details: [
        { key: "name", label: "الإسم", isInput: false },
        { key: "quantity", label: "الكمية", isInput: true },
        { key: "price", label: "السعر", isInput: false },
        { key: "expire_date", label: "تاريخ الصلاحية", isInput: false },
      ],
    },
  ];
  const filtersIncoming = [
    {
      key: "code",
      type: "text",
      placeholder: "إبحث بكود الفاتورة",
      id: "كود فاتورة",
    },
    {
      key: "invoice_price",
      type: "text",
      placeholder: "إبحث بسعر الفاتورة",
      id: "سعر الفاتورة",
    },
    {
      key: "supplier_id",
      type: "selection",
      id: "اختر المورد",
      placeholder: "المورد",
      options: supplier,
    },
    user?.department.type === "master"
      ? {
        key: "department_id",
        type: "selection",
        id: "نوع القسم",
        placeholder: "إختار قسم لإظهار نتائج",
        options: departments.map((department) => {
          return { value: department.id, label: department.name };
        }),
      }
      : null,
    {
      key: "status",
      type: "selection",
      id: "اختر الحالة",
      placeholder: "الحالة",
      options: statusOptions,
    },
    { key: "from_date", type: "date", id: "من تاريخ" },
    { key: "to_date", type: "date", id: "إلى تاريخ" },
  ];
  const filtersOutcoming = [
    { key: "code", type: "text", placeholder: "إبحث بالكود", id: "الكود" },
    {
      key: "invoice_price",
      type: "text",
      placeholder: "إبحث بسعر الفاتورة",
      id: "سعر الفاتورة",
    },
    {
      key: "status",
      type: "selection",
      id: "اختر الحالة",
      placeholder: "الحالة",
      options: statusOptions,
    },
    user?.department.type === "master"
      ? {
        key: "department_id",
        type: "selection",
        id: "نوع القسم",
        placeholder: "إختار قسم لإظهار نتائج",
        options: departments.map((department) => {
          return { value: department.id, label: department.name };
        }),
      }
      : null,
    { key: "from_date", type: "date", id: "من تاريخ" },
    { key: "to_date", type: "date", id: "إلى تاريخ" },
  ];
  const filtersReturn = [
    { key: "code", type: "text", placeholder: "إبحث بالكود", id: "الكود" },
    {
      key: "invoice_price",
      type: "text",
      placeholder: "إبحث بسعر الفاتورة",
      id: "سعر الفاتورة",
    },
    user?.department.type === "master"
      ? {
        key: "department_id",
        type: "selection",
        id: "نوع القسم",
        placeholder: "إختار قسم لإظهار نتائج",
        options: departments.map((department) => {
          return { value: department.id, label: department.name };
        }),
      }
      : null,
    {
      key: "status",
      type: "selection",
      id: "اختر الحالة",
      placeholder: "الحالة",
      options: statusOptions,
    },
    { key: "from_date", type: "date", id: "من تاريخ" },
    { key: "to_date", type: "date", id: "إلى تاريخ" },
  ];

  const actionsIncoming = [
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "create invoice"
      )
        ? "add"
        : ""
        }`,
      label: "اضافة فاتورة مورد",
      route: "/warehouse/invoices/incoming/add-Invoices/in_coming",
    },
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "edit invoice"
      )
        ? "show"
        : ""
        }`,
      label: "مراجعة",
    },
    {
      type: "navigate",
      label: " طباعه",
      route: "/warehouse/invoices/print/:id",
    },
  ];

  const actionsOutComing = [
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "create invoice"
      )
        ? "add"
        : ""
        }`,
      label: "اضافة فاتورة صرف القسم",
      route: "/warehouse/invoices/incoming/add-Invoices/out_going",
    },
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "edit invoice"
      )
        ? "show"
        : ""
        }`,
      label: "مراجعة",
    },
    {
      type: "navigate",
      label: " طباعه",
      route: "/warehouse/invoices/print/:id",
    },
  ];

  const actionsReturnd = [
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "create invoice"
      )
        ? "add"
        : ""
        }`,
      label: "إضافة   فاتورة مرتجع من القسم",
      route: "/warehouse/invoices/incoming/add-Invoices/returned",
    },
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "edit invoice"
      )
        ? "show"
        : ""
        }`,
      label: "مراجعة",
    },
    {
      type: "navigate",
      label: " طباعه",
      route: "/warehouse/invoices/print/:id",
    },
  ];

  // const CategoriesData = [
  //   {
  //     cat: `${user?.department.type === "master"
  //       ? "فاتورة مورد"
  //       : ""
  //       }`, type: `${user?.department.type === "master"
  //         ? "inComing"
  //         : ""
  //         }`
  //   },
  //   { cat: "فاتورة صرف القسم", type: "outGoing" },
  //   { cat: "فاتورة مرتجع من القسم", type: "returnd" },
  // ];

  const CategoriesData = [
    ...(user?.department.type === "source" || user?.department.type === "master"
      ? [{ cat: "فاتورة مورد", type: "inComing" }]
      : []),
    { cat: "فاتورة صرف القسم", type: "outGoing" },
    { cat: "فاتورة مرتجع من القسم", type: "returnd" },
  ];

  const handleCategoryClick = (type) => {
    setSelectedCategory(type);
    console.log(type);
  };

  return (
    <>
      <div className="invoice-container">
        <h1 className="heading text-center p-3">الفواتير </h1>
        <div className="row">
          {CategoriesData.map((category, index) => (
            <Button
              key={index}
              title={category.cat}
              isActive={selectedCategory === category.type}
              onClick={() => handleCategoryClick(category.type)}
            />
          ))}
        </div>
        <div className="invoice-table">
          {user?.department.type === "source" ||
            user?.department.type === "master" ? (
            <>
              {selectedCategory === "inComing" && (
                <Table
                  headers={tableHeaders}
                  filters={filtersIncoming}
                  title="فاتورة مورد"
                  actions={actionsIncoming}
                  fetchData={(filters, id, setIsLoading) =>
                    getIncomingInvoiceByType(filters, id, setIsLoading)
                  }
                  detailsHeaders={detailsHeaders}
                  updateFn={user?.permissions.some(
                    (permission) => permission.name === "edit invoice") ? updateInvoiceQuintity : null}
                  acceptTitle={user?.permissions.some(
                    (permission) => permission.name === "change invoice status") ? { value: "approved", label: "قبول" } : null}
                  rejectTitle={user?.permissions.some(
                    (permission) => permission.name === "change invoice status") ? { value: "rejected", label: "رفض" } : null}
                  changeStatusFn={
                    user.permissions.some(
                      (permission) =>
                        permission.name === "change invoice status"
                    )
                      ? changeInvoiceStatus
                      : null
                  }
                />
              )}
            </>
          ) : null}

          {selectedCategory === "outGoing" && (
            <Table
              headers={tableHeaders}
              filters={filtersOutcoming}
              title="فاتورة صرف القسم"
              actions={actionsOutComing}
              fetchData={(filters, id, setIsLoading) =>
                getOutgoingInvoiceByType(filters, id, setIsLoading)
              }
              detailsHeaders={detailsHeaders}
              updateFn={user?.permissions.some(
                (permission) => permission.name === "edit invoice") ? updateInvoiceQuintity : null}
              acceptTitle={user?.permissions.some(
                (permission) => permission.name === "change invoice status") ? { value: "approved", label: "قبول" } : null}
              rejectTitle={user?.permissions.some(
                (permission) => permission.name === "change invoice status") ? { value: "rejected", label: "رفض" } : null}
              changeStatusFn={
                user.permissions.some(
                  (permission) => permission.name === "change invoice status"
                )
                  ? changeInvoiceStatus
                  : null
              }
            />
          )}
          {selectedCategory === "returnd" && (
            <Table
              headers={tableHeaders}
              filters={filtersReturn}
              title="فاتورة مرتجع من القسم"
              actions={actionsReturnd}
              fetchData={(filters, id, setIsLoading) =>
                getReturndInvoiceByType(filters, id, setIsLoading)
              }
              header={"recipes"}
              showFn={getInvoiceById}
              detailsHeaders={detailsHeaders}
              updateFn={user?.permissions.some(
                (permission) => permission.name === "edit invoice") ? updateInvoiceQuintity : null}
              acceptTitle={user?.permissions.some(
                (permission) => permission.name === "change invoice status") ? { value: "approved", label: "قبول" } : null}
              rejectTitle={user?.permissions.some(
                (permission) => permission.name === "change invoice status") ? { value: "rejected", label: "رفض" } : null}
              changeStatusFn={
                user.permissions.some(
                  (permission) => permission.name === "change invoice status"
                )
                  ? changeInvoiceStatus
                  : null
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Categories;
