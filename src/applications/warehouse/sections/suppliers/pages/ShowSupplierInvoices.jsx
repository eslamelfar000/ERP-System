import { useParams } from "react-router-dom";
import {
  getSupplierById,
  getSupplierInvoices,
} from "../../../../../apis/suppliers";
import { getInvoiceById } from "../../../../../apis/invoices";
import Table from "../../../../../components/shared/table/Table";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
const ShowSupplierInvoices = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getSupplier = async () => {
      const res = await getSupplierById(id);
      setName(res.data.name);
    };
    getSupplier();
  }, []);
  const tableHeaders = [
    { key: "code", value: "كود الفاتورة" },
    { key: "status", value: "الحالة" },
    { key: "invoice_date", value: "تاريخ الإصدار" },
    { key: "registration_date", value: "تاريخ التسجيل" },
    { key: "discount", value: "الخصم" },
    { key: "total_price", value: "سعر الفاتورة" },
  ];
  const actions = [
    {
      type: `${user?.permissions.some(
        (permission) => permission.name === "show supplier invoices"
      )
          ? "show"
          : ""
        }`,
      label: "تفاصيل",
    },
  ];
  const filters = [
    { key: "from_date", type: "date", id: "من تاريخ" },
    { key: "to_date", type: "date", id: "إلى تاريخ" },
    {
      key: "status",
      type: "selection",
      id: "الحالة",
      options: [
        {
          value: "",
          label: "",
        },
        {
          value: "pending",
          label: "تحت المراجعة",
        },
        {
          value: "approved",
          label: "تم المراجعة",
        },
        {
          value: "done",
          label: "تم الصرف",
        },
        {
          value: "rejected",
          label: "مرفوض",
        },
      ],
    },
  ];
  const detailsHeaders = [
    {
      key: "discount",
      label: "الخصم",
    },
    {
      key: "invoice_price",
      label: "سعر الفاتورة",
    },
    {
      key: "recipes",
      label: "المواد الخام",
      isArray: true,
      isInput: true,
      details: [
        { key: "name", label: "الإسم", isInput: false },
        { key: "quantity", label: "الكمية", isInput: true },
        { key: "price", label: "السعر", isInput: false },
      ],
    },
  ];
  return (
    <div>
      <Table
        headers={tableHeaders}
        id={id}
        title={`فواتير ${name}`}
        fetchData={(filterValues, currentPage, id, setIsLoading) =>
          getSupplierInvoices(filterValues, currentPage, id, setIsLoading)
        }
        filters={filters}
        actions={actions}
        detailsHeaders={detailsHeaders}
      // updateFn={() => {}}
      // changeStatusFn={() => {}}
      />
    </div>
  );
};

export default ShowSupplierInvoices;
