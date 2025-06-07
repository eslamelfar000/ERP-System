import React, { useEffect, useState } from "react";
// import "./InvoiceCategory.scss";
// import Button from "./Button/Button";
import {

    updateInvoice,

    getTaintedInvoices,
    getTaintedInvoiceById,
    updateTaintedInvoice,
    changeInvoiceStatus,
} from "../../../../../../apis/invoices";
import Table from "../../../../../../components/shared/table/Table";
import { getSuppliers } from "../../../../../../apis/suppliers";

function ShowTaintedInvoices() {
    const [supplier, setAllSupplier] = useState([]);

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
        { key: "name", label: "الإسم" },
        { key: "quantity", label: "الكمية" },
        { key: "price", label: "السعر", isInput: true },
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
            type: "add",
            label: "اضافة فاتورة هالك",
            route: "/warehouse/invoices/add-tainted-invoices",
        },
        {
            type: "show",
            label: "مراجعة",
        },
        {
            type: "navigate",
            label: " طباعه",
            route: "/warehouse/invoices/print/:id"
        },
    ];



    return (
        <>
            <div className="invoice-container">


                <Table
                    headers={tableHeaders}
                    filters={filtersIncoming}
                    title="الفواتير الهالكة"
                    actions={actionsIncoming}
                    fetchData={(filters, id, setIsLoading) =>
                        getTaintedInvoices(filters, id, setIsLoading)
                    }

                    detailsHeaders={detailsHeaders}
                    updateFn={updateTaintedInvoice}
                    changeStatusFn={changeInvoiceStatus}
                />


            </div>
        </>
    );
}

export default ShowTaintedInvoices;
