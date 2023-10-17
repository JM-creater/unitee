import { useEffect, useState } from 'react';
import './notif.css';
import axios from 'axios';
import { useParams } from 'react-router';

function Notif() {

  const [notification, setNotification] = useState([]);
  const { userId } = useParams();


  useEffect(() => {
    axios.get(`https://localhost:7017/Notification/${userId}`)
      .then(response => {
        setNotification(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };


  return (
    <div className="container px-1 px-md-4 py-5 mx-auto">
      <div className="card">
        {notification.length > 0 ? (
          notification.map((notif, index) => (
            <div key={index} className="row d-flex justify-content-between px-3 top">
              <div className="d-flex">
                
              </div>
              <div className="d-flex flex-column text-sm-right">
                <p className="mb-0">
                  Expected Arrival <span>{formatDate(notif.dateCreated)}</span>
                </p>
                <p>
                  <span className="font-weight-bold">{notif.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="row d-flex justify-content-center px-3 top">
            <p>No notifications available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default Notif
