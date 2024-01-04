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
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const { id } = useParams();

  // * Get the Sales by Weekly, Monthly, Yearly
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weeklyResponse = await axios.get(`https://localhost:7017/Order/weekly?startDate=${new Date().toISOString()}&supplierId=${id}`);
        setWeeklySales(weeklyResponse.data);

        const monthlyResponse = await axios.get(`https://localhost:7017/Order/monthly?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&supplierId=${id}`);
        setMonthlySales(monthlyResponse.data);

        const yearlyResponse = await axios.get(`https://localhost:7017/Order/yearly?year=${new Date().getFullYear()}&supplierId=${id}`);
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
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
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
    <div className="orders-supplier-main-container">
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
                ₱{weeklySales.length > 0 ? weeklySales.reduce((a, b) => a + b) : 0}
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
                ₱{monthlySales.length > 0 ? monthlySales.reduce((a, b) => a + b) : 0}
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
                ₱{yearlySales.length > 0 ? yearlySales.reduce((a, b) => a + b) : 0}
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
      <div className="top-selling-prods-container">
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
  );
}

export default Supplier;
