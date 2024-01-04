import "./supplier_dashboard.css";
import totalSalesIcon from "../../assets/images/icons/dollar.png";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Supplier() {
  const [orders, setOrders] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const { id } = useParams();

  // * Fetch Data of All Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://localhost:7017/Order");
        setOrders(res.data);
      } catch (error) {
        if (error.message === "Network Error") {
          console.error(
            "Network error occurred. Please check your internet connection."
          );
        } else {
          console.error("Error fetching orders: ", error);
        }
      }
    };

    fetchOrders();
  }, []);

  // * Filtered By Status, Departments
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      selectedStatus === "All" ||
      selectedStatus === "" ||
      ord.status === parseInt(selectedStatus, 10);
    const matchesShop = id;

    return matchesStatus && matchesShop;
  });

  // * Get Order By Supplier from Customer
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Order/BySupplier/${id}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [id]);

  // * Get the Sales by Weekly, Monthly, Yearly
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weeklyResponse = await axios.get(
          `https://localhost:7017/Order/weekly?startDate=${new Date().toISOString()}&supplierId=${id}`
        );
        setWeeklySales(weeklyResponse.data);

        const monthlyResponse = await axios.get(
          `https://localhost:7017/Order/monthly?year=${new Date().getFullYear()}&month=${
            new Date().getMonth() + 1
          }&supplierId=${id}`
        );
        setMonthlySales(monthlyResponse.data);

        const yearlyResponse = await axios.get(
          `https://localhost:7017/Order/yearly?year=${new Date().getFullYear()}&supplierId=${id}`
        );
        setYearlySales(yearlyResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Product/top-selling-by-shop/${id}`
        );
        setTopSellingProducts(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchTopSellingProducts();
  }, [id]);

  // * BAR GRAPH
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Yearly Sales",
        data: yearlySales,
        backgroundColor: "#65A4F6",
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const options = {};

  return (
    <div className="report-main-container">
      <div className="row">
        <div className="col-md-7">
          <h3
            style={{
              marginBottom: "20px",
              color: "#020654",
              fontWeight: "600",
              textAlign: "justify",
            }}
          >
            Reports
          </h3>
          <div className="dash-supplier-container">
            <div className="card-content-container">
              <div className="col-md-9 dash-card">
                <span>Weekly Sales</span>
                <h1 className="col-md-11 number-dash">
                  ₱
                  {weeklySales.length > 0
                    ? weeklySales.reduce((a, b) => a + b)
                    : 0}
                </h1>
              </div>
              <img
                className="dash-card-icon"
                src={totalSalesIcon}
                alt="Total Sales Icon"
              />
            </div>
            <div className="card-content-container">
              <div className="col-md-9 dash-card">
                <span>Monthly Sales</span>
                <h1 className="col-md-11 number-dash">
                  ₱
                  {monthlySales.length > 0
                    ? monthlySales.reduce((a, b) => a + b)
                    : 0}
                </h1>
              </div>
              <img
                className="dash-card-icon"
                src={totalSalesIcon}
                alt="Total Orders Icon"
              />
            </div>
            <div className="card-content-container">
              <div className="col-md-9 dash-card">
                <span>Yearly Sales</span>
                <h1 className="col-md-11 number-dash">
                  ₱
                  {yearlySales.length > 0
                    ? yearlySales.reduce((a, b) => a + b)
                    : 0}
                </h1>
              </div>
              <img
                className="dash-card-icon"
                src={totalSalesIcon}
                alt="Total Products Icon"
              />
            </div>
          </div>

          {/* SALES REVIEW CHART */}
          <div
            className="monthly-sales-chart-container"
            style={{
              width: "51.7rem",
              border: "solid 5px white",
              marginTop: "20px",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h1 style={{ color: "#020654" }}>Sales Review</h1>
            <Bar
              style={{ marginTop: "15px" }}
              data={data}
              options={options}
            ></Bar>
          </div>

          <div
            style={{
              width: "51.7rem",
              marginTop: "10px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <button className="generate-report-btn">Generate Report</button>
          </div>
        </div>
        <div className="col-md-5 top-selling-prods-container">
          <h3 className="top-selling-prods-title">Top Selling Products</h3>
          {topSellingProducts.length > 0 ? (
            topSellingProducts.slice(0, 5).map((product) => (
              <div key={product.productId} className="top-prods-container">
                <img
                  className="top-prod-img"
                  src={`https://localhost:7017/${product.image}`}
                  alt={product.productName}
                />
                <span className="top-prod-name">{product.productName}</span>
                <span className="top-prod-price">₱{product.price}</span>
              </div>
            ))
          ) : (
            <span>No Top Selling Products Found</span>
          )}
        </div>
      </div>
      <div
        data-bs-spy="scroll"
        data-bs-target="#navbar-ordersList"
        data-bs-root-margin="0px 0px -40%"
        data-bs-smooth-scroll="true"
        className="scrollspy-example bg-body-tertiary p-3 rounded-2 orderList-admin-container"
        tabIndex={0}
      >
        <h1 id="orderListAdmin" style={{ color: "#020654" }}>
          Order List
        </h1>
        {/* FILTER */}
        <div className="admin-listOrders-filter-container">
          <h4>Sort by</h4>
          <div>
            <label style={{ marginRight: "10px" }} htmlFor="statusOrderFilter">
              Order Status:{" "}
            </label>
            <select
              style={{ padding: "10px", border: "2px solid white" }}
              name="order-status-filter-admin"
              id="statusOrderFilter"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="" disabled hidden selected>
                Select an order status
              </option>
              <option value="All">All</option>
              <option value="1">Order Placed</option>
              <option value="2">Pending</option>
              <option value="3">Approved</option>
              <option value="4">For Pick Up</option>
              <option value="5">Completed</option>
              <option value="6">Canceled</option>
              <option value="7">Denied</option>
            </select>
          </div>

          {/* <div>
            <label style={{ marginRight: "10px" }} htmlFor="supplierFilter">
              Shop
            </label>
            <select
              style={{ padding: "10px", border: "2px solid white" }}
              name="order-status-filter-admin"
              id="supplierFilter"
              //onChange={(e) => setSelectedShop(e.target.value)}
            >
              <option value="" disabled hidden selected>
                Select a shop
              </option>
              <option value="All">All</option>
              {topSellingProducts.map((shop) =>
                shop.role === 2 ? (
                  <option key={shop.id} value={shop.id}>
                    {shop.shopName}
                  </option>
                ) : null
              )}
            </select>
          </div> */}
        </div>

        {/* TABLE */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order No.</th>
              {/* <th className="text-center" scope="col">
                Shop
              </th> */}
              <th className="text-center" scope="col">
                Customer
              </th>
              <th className="text-center" scope="col">
                Number of Items
              </th>
              <th className="text-center" scope="col">
                Total Amount
              </th>
              <th className="text-center" scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => (
              <tr key={ord.id}>
                <th scope="row">{ord.orderNumber}</th>
                {/* <td className="text-center">{ord.cart.supplier.shopName}</td> */}
                <td className="text-center">
                  {ord.user.firstName} {ord.user.lastName}
                </td>
                <td className="text-center">
                  {ord.cart.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </td>
                <td className="text-center">{ord.total}</td>
                <td className="text-center">
                  {ord.status === 1
                    ? "Order Placed"
                    : ord.status === 2
                    ? "Pending"
                    : ord.status === 3
                    ? "Approved"
                    : ord.status === 4
                    ? "For Pick Up"
                    : ord.status === 5
                    ? "Completed"
                    : ord.status === 6
                    ? "Canceled"
                    : ord.status === 7
                    ? "Denied"
                    : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Supplier;
