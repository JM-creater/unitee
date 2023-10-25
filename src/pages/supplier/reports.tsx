import './supplier_dashboard.css'
import totalSalesIcon from "../../assets/images/icons/dollar.png"
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';


function Supplier (){
    
    const [weeklySales, setWeeklySales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [yearlySales, setYearlySales] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        fetch(`https://localhost:7017/Order/BySupplier/${id}`)
        .then((response) => response.json())
        .then((data) => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentWeek = getWeekNumber(currentDate);

            let weeklySalesTotal = 0;
            let monthlySalesTotal = 0;
            let yearlySalesTotal = 0;

            data.forEach((sale) => {
            const saleDate = new Date(sale.date);
            const saleAmount = parseFloat(sale.total); 

            if (saleDate.getFullYear() === currentYear) {
                yearlySalesTotal += saleAmount;
                if (saleDate.getMonth() === currentMonth) {
                monthlySalesTotal += saleAmount;
                if (getWeekNumber(saleDate) === currentWeek) {
                    weeklySalesTotal += saleAmount;
                }
                }
            }
            });

            // Update state with calculated sales
            setWeeklySales(weeklySalesTotal);
            setMonthlySales(monthlySalesTotal);
            setYearlySales(yearlySalesTotal);
        })
        .catch((error) => {
            console.error('Error fetching sales data:', error);
        });
    }, [id]);

    // Helper function to get the week number
    function getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const daysDifference = d.getTime() - yearStart.getTime();
        const daysInWeek = 7 * 24 * 60 * 60 * 1000;

        const weekNumber = Math.ceil((daysDifference + 1) / daysInWeek);

        return weekNumber;
    }


    return (
        <div className='orders-supplier-main-container'>    
        <div className='col-md-7'>
        <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' , textAlign: 'justify'}}>Reports</h3>
        <div  className='dash-supplier-container'>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Weekly Sales</span>
                    <h1 className='col-md-11 number-dash'>{weeklySales}</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Sales Icon"/>
            </div>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Monthly Sales</span>
                    <h1 className='col-md-11 number-dash'>{monthlySales}</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Orders Icon"/>
            </div>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Yearly Sales</span>
                    <h1 className='col-md-11 number-dash'>{yearlySales}</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Products Icon"/>
            </div>
        </div>

        

        <div className='top-selling-prods-container'>
            <h3 className='top-selling-prods-title'>Top Selling Products</h3>
            <div className='top-prods-container'>
                <span className='top-prod-name'>No Product Yet</span>
            </div>
            {/* <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>

            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>

            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div> */}
        </div>
        
        
        
        </div>
            
        </div>
    )
}

export default Supplier