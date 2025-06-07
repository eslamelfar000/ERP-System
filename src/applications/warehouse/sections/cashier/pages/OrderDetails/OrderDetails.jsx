import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTableOrderById } from "../../../../../../apis/cashier";
import "./OrderDetails.scss";
import ShowDataModal from "../../../../../../components/ui/ShowDataModal/ShowDataModal";
import {
  updateProductQuantityInOrder,
  deleteProductQuantityInOrder,
} from "../../../../../../apis/orders";

import { useNavigate } from "react-router-dom";
const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isModalVisible, setisModalVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getOrderByID = async () => {
      try {
        const res = await getTableOrderById(id);
        console.log(res.data);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    getOrderByID();
  }, [id]);

  const detailsHeaders = [
    {
      key: "quantity",
      label: "الكمية",
      isInput: true,
    },
  ];
  return (
    <div>
      {order.code && (
        <div>
          <h1 className="order-title"> اوردر كود {order.code}</h1>
          <div className="order-header">
            {order.comment && <p>ملاحظة: {order.comment}</p>}
            {order.discount !== null && <p>قيمةالخصم: {order.discount}</p>}
            {order.discount_resones && (
              <p>سبب الخصم: {order.discount_resones}</p>
            )}
            {order.order_date && <p>تاريخ الأوردر: {order.order_date}</p>}
            {order.target_department_name && (
              <p>إسم القسم المراد: {order.target_department_name}</p>
            )}
          </div>
          <h2>المنتجات:</h2>
          <button
            className="add-btn"
            onClick={() => {
              navigate(`/warehouse/cashier/${id}/add-products-to-order`);
            }}
          >
            إضافة منتجات
          </button>
          <ul className="order-details-container">
            {order.products &&
              order.products.map((product, index) => {
                console.log(product);
                return (
                  <li key={index} className="order">
                    <div className="img-container">
                      <img
                        className="product-image"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="order-details-txt">
                      <p>إسم المنتج: {product.name}</p>
                      <p>السعر: {product.price} جم</p>
                      <p>الكمية: {product.quantity}</p>
                    </div>
                    <div className="product-buttons">

                      <button
                        className="product-button edit"
                        onClick={async () => {
                          setCurrentProductId(product.id);
                          setCurrentProduct(product);
                          setisModalVisible(true);
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        className="product-button delete"
                        onClick={async () => {
                          await deleteProductQuantityInOrder(
                            product.product_id_in_order
                          );
                          window.location.reload();
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      {isModalVisible && (
        <ShowDataModal
          id={currentProductId}
          detailsHeaders={detailsHeaders}
          responseData={currentProduct}
          handleModalVisible={setisModalVisible}
          updateFn={updateProductQuantityInOrder}
          closeAfterEdit={true}
        />
      )}
    </div>
  );
};

export default OrderDetails;
