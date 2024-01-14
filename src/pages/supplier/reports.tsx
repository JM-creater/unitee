import "./supplier_dashboard.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ExcelJS from "exceljs"
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import orderEventEmitter from "../../helpers/OrderEmitter";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Supplier() {
  const [orders, setOrders] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { id } = useParams();

   // * Download Report to PDF
  const HandleExportToPDF = async () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const ordersData = filteredOrders.map((ord) => ({
      OrderNumber: ord.orderNumber,
      Customer: `${ord.user.firstName} ${ord.user.lastName}`,
      Items: ord.cart.items.reduce((total, item) => total + item.quantity, 0),
      Total: ord.total,
      Status: getStatusText(ord.status),
    }));

    const totalSales = ordersData.reduce((total, order) => total + order.Total, 0);

    const salesData = [
      {
          Type: "Weekly Sales",
          Amount:
              weeklySales.length > 0 ? weeklySales.reduce((a, b) => a + b) : 0,
      },
      {
          Type: "Monthly Sales",
          Amount:
              monthlySales.length > 0 ? monthlySales.reduce((a, b) => a + b) : 0,
      },
      {
          Type: "Yearly Sales",
          Amount:
              yearlySales.length > 0 ? yearlySales.reduce((a, b) => a + b) : 0,
      },
    ];

    const pdfDefinition = {
        header: function (/*currentPage, pageCount, pageSize*/) {
            return {
                text: (filteredOrders.length > 0 && filteredOrders[0].cart.supplier.shopName) || 'Default Header',
                alignment: 'center',
                fontSize: 18,
                bold: true,
                margin: [0, 10, 0, 0], 
            };
        },
        content: [
        {
            text: "Sales Report",
            alignment: "center",
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 20], 
        },
        {
            table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto"],
            body: [
                [{ text: "OrderNumber", style: "tableHeader" }, { text: "Customer", style: "tableHeader" }, { text: "Items", style: "tableHeader" }, { text: "Status", style: "tableHeader" }, { text: "Total", style: "tableHeader" }],
                  ...ordersData.map((order) => [
                  order.OrderNumber,
                  order.Customer,
                  order.Items,
                  order.Status,
                  { text: `₱${order.Total.toFixed(2)}`, style: "tableCell" },
                ]),
                [
                  { text: "", colSpan: 3, border: [0, 0, 0, 0] }, 
                  {},
                  {},
                  { text: "Total Sales", style: "tableHeaderWithBorders" }, 
                  { text: `₱${totalSales.toFixed(2)}`, style: "tableCellWithBorders" }, 
                ],
            ],
            },
        },
        "\n",
        {
          text: "Sales Summary",
          alignment: "center",
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
        },
        {
            table: {
              headerRows: 1,
              widths: ["*", "auto"],
                body: [
                    [{ text: "Type", style: "tableHeader" }, { text: "Amount", style: "tableHeader" }],
                    ...salesData.map((sale) => [sale.Type, `₱${sale.Amount.toFixed(2)}`]),
                ],
              },
              layout: {
                fillColor: function (rowIndex, /*node, columnIndex*/) {
                    return rowIndex === 0 ? "#2C3E50" : null;
              },
            },
        },
        "\n",
        {
            table: {
            headerRows: 1,
            widths: ["*"],
              body: [
                  [{ text: "Total Orders", style: "tableHeader" }],
                  [orders && orders.length > 0 ? orders.length : 0],
              ],
            },
            layout: {
              fillColor: function (rowIndex, /*node, columnIndex*/) {
                  return rowIndex === 0 ? "#2C3E50" : null;
              },
            },
        },
        ],
        styles: {
          tableHeader: {
              bold: true,
              fontSize: 12,
              color: "white",
              fillColor: "#34495E", 
          },
          tableCell: {
              fontSize: 12,
          },
          tableHeaderWithBorders: {
              bold: true,
              fontSize: 12,
              color: "white",
              fillColor: "#34495E", 
              border: [0, 0, 0, 1], 
          },
          tableCellWithBorders: {
              fontSize: 12,
              border: [0, 0, 0, 1], 
          },
        },
    };

    const pdfDocGenerator = pdfMake.createPdf(pdfDefinition);
    pdfDocGenerator.download("SalesReport.pdf");
  };
  

  // * Download Report to Excel
  const HandleExportToExcel = async () => {
    const ordersData = filteredOrders.map(ord => ({
      OrderNumber: ord.orderNumber,
      Customer: ord.user && `${ord.user.firstName} ${ord.user.lastName}`,
      Items: ord.cart && ord.cart.items ? ord.cart.items.reduce((total, item) => total + item.quantity, 0) : 0,
      Total: ord.total ? ord.total.toLocaleString('en-US', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      }) : "₱0.00",
      Status: ord.status ? getStatusText(ord.status) : 'Unknown'
    }));
  

    const salesData = [
        { Type: 'Weekly Sales', Amount: weeklySales.length > 0 ? weeklySales.reduce((a, b) => a + b) : 0 },
        { Type: 'Monthly Sales', Amount: monthlySales.length > 0 ? monthlySales.reduce((a, b) => a + b) : 0 },
        { Type: 'Yearly Sales', Amount: yearlySales.length > 0 ? yearlySales.reduce((a, b) => a + b) : 0 }
    ];

    const workbook = new ExcelJS.Workbook();

    const ordersSheet = workbook.addWorksheet('Orders');

    ordersSheet.columns = [
        { header: 'OrderNumber', key: 'OrderNumber', width: 15 },
        { header: 'Customer', key: 'Customer', width: 20 },
        { header: 'Items', key: 'Items', width: 15 },
        { header: 'Total', key: 'Total', width: 10 },
        { header: 'Status', key: 'Status', width: 15 }
    ];

    ordersSheet.addRows(ordersData);

    ordersSheet.getRow(1).eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFAA00' }
        };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
        };
        cell.font = { bold: true };
    });

    const salesSheet = workbook.addWorksheet('Sales');

    salesSheet.columns = [
        { header: 'Type', key: 'Type', width: 20 },
        { header: 'Amount', key: 'Amount', width: 15 }
    ];

    salesSheet.addRows(salesData);

    salesSheet.getRow(1).eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFAA00' }
        };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
        };
        cell.font = { bold: true };
    });

    const totalOrdersSheet = workbook.addWorksheet('Total Orders');

    totalOrdersSheet.columns = [
        { header: 'Total Orders', key: 'totalOrders', width: 20 }
    ];

    if (orders && orders.length > 0) {
        totalOrdersSheet.addRow({ totalOrders: orders.length });
    } else {
        totalOrdersSheet.addRow({ totalOrders: 0 });
    }

    totalOrdersSheet.getRow(1).eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFAA00' }
        };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
        };
        cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'Report.xlsx';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowModal(!showModal);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Order Placed';
      case 2:
        return 'Pending';
      case 3:
        return 'Approved';
      case 4:
        return 'For Pick Up';
      case 5:
        return 'Completed';
      case 6:
        return 'Canceled';
      case 7:
        return 'Denied';
      default:
        return 'Unavailable'; 
    }
  };

  // * Fetch Data of All Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Order/BySupplier/${id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    const validationListener = () => {
      fetchOrders();
    }

    orderEventEmitter.on("statusUpdate", validationListener);
    validationListener();

    return () => {
      orderEventEmitter.off("statusUpdate", validationListener);
    };
  }, [id]);

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
    try {
          const response = await axios.get(`https://localhost:7017/Order/BySupplier/${id}`);
          setOrders(response.data);
        } catch (error) {
          console.error('Network error or server not responding');
        }
    };

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [id]);

  // * Filtered By Status, Departments
  const filteredOrders = orders.filter((ord) => {
    const orderDate = new Date(ord.dateCreated);
    const matchesDateRange =
      (!startDate || orderDate >= new Date(startDate)) &&
      (!endDate || orderDate <= new Date(endDate));
    const matchesStatus =
      selectedStatus === "All" ||
      selectedStatus === "" ||
      ord.status === parseInt(selectedStatus, 10);
    return matchesDateRange && matchesStatus;
  });
  
  

  // * Get the Sales by Weekly, Monthly, Yearly
  useEffect(() => {
    const fetchSalesData = async () => {
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

    const validationListener = () => {
      fetchSalesData();
    }

    orderEventEmitter.on("updateSalesReport", validationListener);
    validationListener();

    return () => {
      orderEventEmitter.off("updateSalesReport", validationListener);
    };
  }, [id]);

  // * Windows Event Listener Focus
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

    const handleFocus = () => {
        fetchData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
        window.removeEventListener('focus', handleFocus);
    };
  }, [id]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Product/top-selling-by-shop/${id}`);
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
      <div className="report-main-container" id="report-container">
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
                    {weeklySales.length > 0
                        ? weeklySales.reduce((a, b) => a + b).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        : "₱0.00"}
                  </h1>
                </div>
              </div>
              <div className="card-content-container">
                <div className="col-md-9 dash-card">
                  <span>Monthly Sales</span>
                  <h1 className="col-md-11 number-dash">
                    {monthlySales.length > 0
                      ? monthlySales.reduce((a, b) => a + b).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : "₱0.00"}
                  </h1>
                </div>
              </div>
              <div className="card-content-container">
                <div className="col-md-9 dash-card">
                  <span>Yearly Sales</span>
                  <h1 className="col-md-11 number-dash">
                    {yearlySales.length > 0
                      ? yearlySales.reduce((a, b) => a + b).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : "₱0.00"}
                  </h1>
                </div>
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
              <button className="generate-report-btn" data-bs-toggle="modal" data-bs-target="#exportModal">Generate Report</button>
            </div>
          </div>
          <div className="col-md-4 top-selling-prods-ReportsContainer">
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
                  <span className="top-prod-price">
                    {product.price ? product.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : "₱0.00"}
                  </span>
                </div>
              ))
            ) : (
              <span>No Top Selling Products Found</span>
            )}
          </div>
        </div>
        <div className='modal fade' id="exportModal" tabIndex={1} aria-labelledby="exportModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="logout-confirmation-modalBody">
                        <h3>Select Format to Export Report</h3>
                        <div className="col-md-12 logout-btn-container">
                            <button className="logout-btn" data-bs-dismiss="modal" onClick={HandleExportToExcel}>Excel</button>
                            <button className="cancel-logout-btn" data-bs-dismiss="modal" onClick={HandleExportToPDF}>PDF</button>
                        </div>
                    </div>
                </div>
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
            <div>
              <label style={{ marginRight: "10px" }} htmlFor="statusOrderFilter">Start Date:</label>
              <input
                style={{ padding: "10px", border: "2px solid white" }}
                name="order-status-filter-admin"
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label style={{ marginRight: "10px" }} htmlFor="statusOrderFilter">End Date:</label>
              <input
                style={{ padding: "10px", border: "2px solid white" }}
                name="order-status-filter-admin"
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
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
                  <td className="text-center">
                    {ord.user.firstName} {ord.user.lastName}
                  </td>
                  <td className="text-center">
                    {ord.orderItems.length}
                  </td>
                  <td className="text-center">
                    {ord.total ? ord.total.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : "₱0.00"}
                  </td>
                  <td className="text-center">
                    {
                      ord.status === 1
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
                      : "Unavailable"
                    }
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
