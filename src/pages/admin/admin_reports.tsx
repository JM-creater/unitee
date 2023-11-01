import './admin_reports.css'
import totalOrdersIcon from "../../assets/images/icons/order-2.png"
import salesIcon from "../../assets/images/icons/sales.png"
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

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
)

function Admin_Reports () {

    // BAR GRAPH
    const salesData = {
        labels: ['January', 'February', 'March'],
        datasets: [
            {
                label: 'Supplier 1',
                data: [ 3,6,7 ],
                backgroundColor: '#004AAD',
                borderColor: 'white',
                borderWidth: 1,
            },
            {
                label: 'Supplier 2',
                data: [ 4,5,1 ],
                backgroundColor: '#65A4F6',
                borderColor: 'white',
                borderWidth: 1,
            },
            {
                label: 'Supplier 3',
                data: [ 8,3,5 ],
                backgroundColor: '#020654',
                borderColor: 'white',
                borderWidth: 1,
            },
            {
                label: 'Supplier 4',
                data: [ 7,1,6 ],
                backgroundColor: '#FDB833',
                borderColor: 'white',
                borderWidth: 1,
            }
        ]
    }

    // END OF BAR GRAPH``

    // PIE CHART GRAPH
    const ordersData = {
        labels: ['Supplier 1', 'Supplier 2', 'Supplier 3', 'Supplier 4'],
        datasets: [
            {
                data: [3,6,9,10],
                backgroundColor: ['#004AAD', '#65A4F6', '#020654', '#FDB833']
            }
        ]
    };


    const options = {

    }

    return <div className="admin-reports-main-container">
        <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Reports</h3>
        <div className='admin-reports-header'>
            {/* HEADER CARDS */}
            <div className='admin-reports-allOrders-card'>
                <div className='col-md-9'>
                    <h5>Total Orders</h5>
                    <h3>53485</h3>
                    <button className='view-allOrders-btn-admin'>View all orders</button>
                </div>
                    <img className='admin-reports-headerIcons' src={ totalOrdersIcon } alt="" />
                <div>

                </div>
            </div>

            <div className='admin-salesCards-container'>
                <div className='admin-sales-card'>
                    {/* WEEKLY */}
                    <div className='col-md-9'>
                        <h5>Weekly Sales</h5>
                        <h3>4533</h3>
                    </div>
                    <img className='admin-reports-headerIcons' src={ salesIcon }/>
                </div>

                {/* MONTHLY */}
                <div className='admin-sales-card'>
                    <div className='col-md-9'>
                        <h5>Monthly Sales</h5>
                        <h3>4533</h3>
                    </div>
                    <img className='admin-reports-headerIcons' src={ salesIcon }/>
                </div>

                {/* YEARLY */}
                <div className='admin-sales-card'>
                    <div className='col-md-9'>
                        <h5>Yearly Sales</h5>
                        <h3>4533</h3>
                    </div>
                    <img className='admin-reports-headerIcons' src={ salesIcon }/>
                </div>
            </div>
            {/* GENERATE REPORT BUTTON */}
            <button className='admin-generate-report-btn'>Generate Report</button>
        </div>
        {/* END OF HEADER CARDS */}


        {/* BAR AND CHART GRAPH CONTAINER */}
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
                    <span>Suppliers average sales for the past 
                        <span className='num-months-chartReview'> number of months </span>
                            is <span className='total-sales-chartReview'> $100000</span>
                    </span>
                    <Bar
                        style={{ marginTop:'15px' }}
                        data= { salesData }
                        options= { options }
                    ></Bar>
            </div>

            

            {/* ORDERS REVIEW PIE CHART */}
            <div style={{ 
                marginTop:'20px',
                border: 'solid 5px white',
                borderRadius: '5px',
                padding: '20px',
                width:'500px'
             }}>
                <div
                    style={{ 
                        width: '300px',
                        height: '300px'
                    }}>
                        <h1 style={{ color:'#020654' }}>Orders Review</h1>
                    <Pie
                        data = { ordersData }
                        options= { options }>

                    </Pie>

                </div>
            </div>
        </div>
    </div>
}

export default Admin_Reports