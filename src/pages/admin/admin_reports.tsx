import './admin_reports.css'
import totalOrdersIcon from "../../assets/images/icons/order-2.png"
import salesIcon from "../../assets/images/icons/sales.png"
import ExcelJS from "exceljs"
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
)

function Admin_Reports () {

    const [weeklySales, setWeeklySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [yearlySales, setYearlySales] = useState([]);
    const [orders, setOrders] = useState([]);
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [supplierOrderCounts, setSupplierOrderCounts] = useState({});


    // * Get the Sales by Weekly, Monthly, Yearly
    useEffect(() => {
        const fetchData = async () => {
            try {
                const weeklyResponse = await axios.get(`https://localhost:7017/Order/weeklyAdmin?startDate=${new Date().toISOString()}`);
                setWeeklySales(weeklyResponse.data);
        
                const monthlyResponse = await axios.get(`https://localhost:7017/Order/monthlyAdmin?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`);
                setMonthlySales(monthlyResponse.data);
        
                const yearlyResponse = await axios.get(`https://localhost:7017/Order/yearlyAdmin?year=${new Date().getFullYear()}`);
                setYearlySales(yearlyResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // * Fetch Data of All Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('https://localhost:7017/Order');
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders: ", error);
            }
        };

        fetchOrders();
    }, []);

    // * Fetch Data of All Shops
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await axios.get('https://localhost:7017/Users');
                    setShops(res.data);
            } catch (error) {
                console.error("Error fetching orders: ", error);
            }
        };

        fetchShops();
    }, []);

    // * Download Report to Excel
    const HandleExportToExcel = async () => {
        const ordersData = filteredOrders.map(ord => ({
            OrderNumber: ord.orderNumber,
            Shop: ord.cart.supplier.shopName,
            Customer: `${ord.user.firstName} ${ord.user.lastName}`,
            Items: ord.cart.items.reduce((total, item) => total + item.quantity, 0),
            Total: ord.total,
            Status: getStatusText(ord.status)
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
            { header: 'Shop', key: 'Shop', width: 20 },
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
    };


    // * Get Status
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
    
    // * Count the orders each supplier in pie graph
    useEffect(() => {
        const countOrdersPerSupplier = orders.reduce((acc, order) => {
            const supplierId = order.cart.supplier.id;
            acc[supplierId] = (acc[supplierId] || 0) + 1;
            return acc;
        }, {});

        setSupplierOrderCounts(countOrdersPerSupplier);
    }, [orders]);

    // * Filtered By Status, Departments
    const filteredOrders = orders.filter((ord) => {
        const matchesStatus = selectedStatus === 'All' || selectedStatus === '' || (ord.status === parseInt(selectedStatus, 10));
        const matchesShop = selectedShop === 'All' || selectedShop === '' || (ord.cart.supplier.id === parseInt(selectedShop, 10));
    
        return matchesStatus && matchesShop;
    });

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

    // * PIE CHART CHART
    const pieChartData = {
        labels: Object.keys(supplierOrderCounts).map(supplierId => 
            shops.find(shop => shop.id === parseInt(supplierId))?.shopName || 'Unknown'
        ),
        datasets: [{
            data: Object.values(supplierOrderCounts),
            backgroundColor: ['#004AAD', '#65A4F6', '#020654', '#FDB833']
        }]
    };

    const options = {}

    return <div className="admin-reports-main-container">
        <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Reports</h3>
        <div className='admin-reports-header'>
            {/* HEADER CARDS */}
            <div className='admin-reports-allOrders-card'>
                <div className='col-md-9'>
                    <h5 className='header-adminSales-label'>Total Orders</h5>
                    <h3>{orders ? orders.length : 0}</h3>
                    <ul className="nav nav-pills"
                    style={{
                        display:'flex',
                        justifyContent:'center',
                        borderRadius:'20px',
                        border:'solid 1px black' }}>
                        <a 
                            className="nav-link view-allOrders-btn-admin" 
                            href="#orderListAdmin" 
                            id="navbar-ordersList"
                        >
                            View all orders
                        </a>
                    </ul>

                </div>
                    <img className='admin-reports-headerIcons' src={ totalOrdersIcon } alt="" />
                <div>

                </div>
            </div>

            <div className='admin-salesCards-container'>
                <div className='admin-sales-card'>
                    {/* WEEKLY */}
                    <div className='col-md-9'>
                        <h5 className='header-adminSales-label'>Weekly Sales</h5>
                        <h3>₱{weeklySales.length > 0 ? weeklySales.reduce((a, b) => a + b) : 0}</h3>
                    </div>
                    <img className='admin-reports-headerIcons' src={ salesIcon }/>
                </div>

                {/* MONTHLY */}
                <div className='admin-sales-card'>
                    <div className='col-md-9'>
                        <h5 className='header-adminSales-label'>Monthly Sales</h5>
                        <h3>₱{monthlySales.length > 0 ? monthlySales.reduce((a, b) => a + b) : 0}</h3>
                    </div>
                    <img className='admin-reports-headerIcons' src={ salesIcon }/>
                </div>

                {/* YEARLY */}
                <div className='admin-sales-card'>
                    <div className='col-md-9'>
                        <h5 className='header-adminSales-label'>Yearly Sales</h5>
                        <h3>₱{yearlySales.length > 0 ? yearlySales.reduce((a, b) => a + b) : 0}</h3>
                    </div>
                    <img className='admin-reports-headerIcons' src={ salesIcon }/>
                </div>
            </div>
            {/* GENERATE REPORT BUTTON */}
            <button className='admin-generate-report-btn' onClick={HandleExportToExcel}>Generate Report</button>
        </div>

        <div 
        style={{ display:'flex', flexFlow:'row', justifyContent:'space-evenly' }}>
            {/* SALES REVIEW BAR CHART */}
        <div className='monthly-sales-chart-container'
                    style={{ width:'51.7rem',
                    border:'solid 5px white',
                    marginTop:'20px',
                    padding:'20px',
                    borderRadius:'10px'}}>
                    
                    <h1 style={{ color:'#020654' }}>Sales Review</h1>
                    
                    <Bar
                        style={{ marginTop:'15px' }}
                        data= { data }
                        options= { options }
                    ></Bar>
            </div>

            {/* ORDERS REVIEW PIE CHART */}
            <div style={{ 
                marginTop:'20px',
                border: 'solid 5px white',
                borderRadius: '10px',
                padding: '20px',
                width:'500px'
            }}>
                <div
                    style={{ 
                        width: '300px',
                        height: '300px'
                    }}>
                        <h1 style={{ color:'#020654' }}>Orders Review</h1>
                        <Pie data={pieChartData} options={options} />
                </div>
            </div>
        </div>
    
        <div data-bs-spy="scroll"
            data-bs-target="#navbar-ordersList" 
            data-bs-root-margin="0px 0px -40%" 
            data-bs-smooth-scroll="true" 
            className="scrollspy-example bg-body-tertiary p-3 rounded-2 orderList-admin-container" 
            tabIndex={0}>
            <h1 id="orderListAdmin" style={{ color:'#020654' }}>Order List</h1>
            {/* FILTER */}
            <div className='admin-listOrders-filter-container'>
                <h4>Sort by</h4>
                <div>
                    <label style={{ marginRight:'10px' }} htmlFor="statusOrderFilter">Order Status: </label>
                    <select style={{ padding: '10px', border: '2px solid white' }} name="order-status-filter-admin" id="statusOrderFilter" onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="" disabled hidden selected>Select an order status</option>
                        <option value="All" >All</option>
                        <option value="1">Order Placed</option>
                        <option value="2">Pending</option>
                        <option value="3">Approved</option>
                        <option value="4">For Pick Up</option>
                        <option value="5">Completed</option>
                        <option value="6">Canceled</option>
                        <option value="7">Denied</option>
                    </select>
                </div>

                <div>
                    <label style={{ marginRight:'10px' }} htmlFor="supplierFilter">Shop</label>
                    <select 
                        style={{ padding: '10px', border: '2px solid white' }} 
                        name="order-status-filter-admin" 
                        id="supplierFilter" 
                        onChange={(e) => setSelectedShop(e.target.value)}
                    >
                        <option value="" disabled hidden selected>Select a shop</option>
                        <option value="All">All</option>
                        {shops.map((shop) => 
                            shop.role === 2 ? (
                                <option key={shop.id} value={shop.id}>{shop.shopName}</option>
                            ) : null
                        )}
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Order No.</th>
                    <th className='text-center' scope="col">Shop</th>
                    <th className='text-center' scope="col">Customer</th>
                    <th className='text-center' scope="col">Number of Items</th>
                    <th className='text-center' scope="col">Total Amount</th>
                    <th className='text-center' scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                {filteredOrders.map((ord) => 
                    <tr key={ord.id}>
                        <th scope="row">{ord.orderNumber}</th>
                        <td className='text-center'>{ord.cart.supplier.shopName}</td>
                        <td className='text-center'>{ord.user.firstName} {ord.user.lastName}</td>
                        <td className='text-center'>{ord.orderItems.reduce((total, item) => total + item.quantity, 0)}</td>
                        <td className='text-center'>{ord.total}</td>
                        <td className='text-center'>
                            {
                                ord.status === 1 ? 'Order Placed' : 
                                ord.status === 2 ? 'Pending' : 
                                ord.status === 3 ? 'Approved' : 
                                ord.status === 4 ? 'For Pick Up' : 
                                ord.status === 5 ? 'Completed' : 
                                ord.status === 6 ? 'Canceled' : 
                                ord.status === 7 ? 'Denied' : 'Unavailable' 
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    </div>
}

export default Admin_Reports