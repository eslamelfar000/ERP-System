import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import LogoDAR from "../../../../../../../public/assets/images/Dar_logo.svg";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { getOrderById } from "../../../../../../apis/orders";

function PrintOrder() {
  const { id } = useParams();
  const [data, setData] = useState({
    code: "",
    status: "",
    client: "",
    invoice_date: "",
    client_type: "",
    recipeData: [],
    total_price: 0,
    total_price_after_discount: 0,
    departmentName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const InvoiceData = await getOrderById(id);
        console.log(InvoiceData.data);
        setData({
          code: InvoiceData.data.code,
          status: InvoiceData.data.status,
          invoice_date: InvoiceData.data.order_date,
          client: InvoiceData.data.client,
          client_type: InvoiceData.data.client_type,
          recipeData: InvoiceData.data.products,
          total_price: InvoiceData.data.total_price,
          total_price_after_discount:
            InvoiceData.data.total_price_after_discount,
          departmentName: InvoiceData.data.department,
        });
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  const generatePDF = () => {
    const element = document.getElementById("invoice-container");
    html2pdf()
      .from(element)
      .save(`${data.code + "-" + "أوردر كود"}.pdf`);
  };
  useEffect(() => {
    if (data.status) generatePDF();
  }, [data]);
  return (
    <main>
      <div id="invoice-container" style={{ padding: "5rem" }}>
        <div className="headers-wrapper">
          {data.status === "approved" && (
            <div className="status-green">
              <p>تم المراجعة</p>
            </div>
          )}
          {data.status === "rejected" && (
            <div className="status-red">
              <p>تم الرفض</p>
            </div>
          )}
          {data.status === "done" && (
            <div className="status-black">
              <p> تم الصرف</p>
            </div>
          )}
          {data.status === "pending" && (
            <div className="status-yellow">
              <p> تحت المراجعة</p>
            </div>
          )}
          {data.invoiceType === "in_coming" && (
            <div className="main-title">
              <p>فاتورة مورد </p>
            </div>
          )}
          {data.invoiceType === "out_going" && (
            <div className="main-title">
              <p> إذن صرف </p>
            </div>
          )}
          {data.invoiceType === "returned" && (
            <div className="main-title">
              <p> فاتورة مرتجع </p>
            </div>
          )}
          <div className="main-title">
            <p> أوردر إلى {data.departmentName}</p>
          </div>
          <div className="header-img">
            <img
              src={LogoDAR}
              alt=""
              style={{ width: "64px", marginBottom: "5px", marginLeft: "5px" }}
            />
          </div>
        </div>
        <div className="invoice-info">
          <div className="invoice-info-item">
            <h2>تـفاصيل الأوردر :</h2>
            <p>كـــــود الأوردر : {data.code}</p>
            <p>تـاريـــخ الأوردر : {data.invoice_date}</p>
          </div>
        </div>
        <div className="invoice-items">
          <h2>محــــــتويات الأوردر</h2>
          <table>
            <thead>
              <tr>
                <th className="text-center">رقم العنصر</th>
                <th className="text-center">اسم العنصر</th>
                <th className="text-center">سعر العنصر الواحد</th>
                <th className="text-right">الكمية</th>
              </tr>
            </thead>
            <tbody>
              {data.recipeData.map((recipe, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{recipe.name}</td>
                  <td className="text-center">{recipe.price}</td>
                  <td className="text-right">{recipe.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>السعر الكلي</td>
                <td colSpan={2}>{data.total_price} ج.م</td>
              </tr>
              <tr>
                <td colSpan={2}>السعر الكلي بعد الخصم</td>
                <td colSpan={2}>{data.total_price_after_discount} ج.م</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}

export default PrintOrder;
