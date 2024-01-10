import "./shop.css";
import { Link, useParams } from "react-router-dom";
import starIcon from "../../assets/images/icons/starRating.png";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingGif from "../../assets/images/icons/loadingscreen.svg";
//sample please do not include in merging

function Shop() {
  const [shop, setShop] = useState([]);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRatingSupplier, setAverageRatingSupplier] = useState({});
  const [, setProductData] = useState([]);
  const [recommendedOverAll, setRecommendedOverAll] = useState([]);
  const { userId } = useParams();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // * Get the Average Rating for Product
  useEffect(() => {
    if (!departmentId) return;

    const fetchAverageRatingSupplier = async () => {
      try {
        const supplierResponse = await axios.get(
          `https://localhost:7017/Users/getSuppliersProduct/${departmentId}`
        );
        setProductData(supplierResponse.data);

        const ratingsPromises = supplierResponse.data.map((supplier) =>
          axios.get(
            `https://localhost:7017/Rating/average-supplier-rating/${supplier.id}`
          )
        );

        const ratingsResponses = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsResponses.reduce((acc, response, index) => {
          acc[supplierResponse.data[index].id] = response.data.averageRating;
          return acc;
        }, {});

        setAverageRatingSupplier(ratingsMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAverageRatingSupplier();
  }, [departmentId]);

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResponse = await axios.get(
          `https://localhost:7017/Users/getSuppliersProduct/${departmentId}`
        );
        setProductData(supplierResponse.data);

        const ratingsPromises = supplierResponse.data.map((supplier) =>
          axios.get(
            `https://localhost:7017/Rating/average-supplier-rating/${supplier.id}`
          )
        );

        const ratingsResponses = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsResponses.reduce((acc, response, index) => {
          acc[supplierResponse.data[index].id] = response.data.averageRating;
          return acc;
        }, {});

        setAverageRatingSupplier(ratingsMap);
      } catch (error) {
        console.error(error);
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [departmentId]);

  // * Get User Department
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://localhost:7017/Users/UserDepartment/${userId}`)
      .then(async (res) => {
        setDepartmentId(res.data.departmentId);
        await sleep(50);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [userId]);

  // * Get Products By Supplier
  useEffect(() => {
    if (!departmentId) return;
    axios
      .get(`https://localhost:7017/Users/getSuppliersProduct/${departmentId}`)
      .then(async (res) => {
        setShop(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [departmentId]);

  // * Get Over All Recommended Products
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`https://localhost:7017/Product/recommendedOverAll?userId=${userId}`)
      .then(async (res) => {
        setRecommendedOverAll(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="mainloading-screen">
          <img className="mainloading-bar" src={LoadingGif} alt="loading..." />
        </div>
      ) : (
        <div className="container shop-contianer">
          <div className="content-container">
            <div className="col-md-12 shopCustomer-title-container">
              <div className="motto-container">
                <p className="shop-title1">New Clothes,</p>
                <p className="shop-title2">New Passion.</p>
              </div>
              <div
                id="carouselExample"
                className="carousel carousel-dark slide"
              >
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    {recommendedOverAll.slice(0, 1).map((firstRecommended) => (
                      <div className="featuredProd-card">
                        <div className="prod-card-featured">
                          <img
                            className="featuredProd-img d-block w-100"
                            src={`https://localhost:7017/${firstRecommended.image}`}
                          />
                          <div className="featured-prod-details">
                            <h3 className="featuredProd-name">
                              {firstRecommended.productName}
                            </h3>
                            <span className="featuredProd-rating">
                              prod rating
                            </span>
                            <h3 className="featuredProd-price">
                              ₱{firstRecommended.price.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {recommendedOverAll.slice(1, 3).map((recommendedOverAll) => (
                    <div className="carousel-item">
                      <div className="featuredProd-card">
                        <div className="prod-card-featured">
                          <img
                            className="featuredProd-img d-block w-100"
                            src={`https://localhost:7017/${recommendedOverAll.image}`}
                          />
                          <div className="featured-prod-details">
                            <h3 className="featuredProd-name">
                              {recommendedOverAll.productName}
                            </h3>
                            <span className="featuredProd-rating">
                              prod rating
                            </span>
                            <h3 className="featuredProd-price">
                              ₱{recommendedOverAll.price.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>

            <div className="col-md-10 shopLabel-text-container">
              <h2 className="visit-shop-text">Shops for you to visit</h2>
            </div>

            <div className="supplier-container">
              {shop.map((shops, index) => (
                <Link
                  key={index}
                  className="link-to-seller"
                  to={`/shop/${userId}/visit_shop/${shops.id}`}
                >
                  <div className="supplier-card">
                    <img
                      src={`https://localhost:7017/${shops.image}`}
                      className="supplierCard-img"
                    />
                    <div className="col-md-8 shop-card-details">
                      <h5 className="supplier-card-title">{shops.shopName}</h5>
                      <h5 className="shop-rating-card">{shops.address}</h5>
                      <React.Fragment>
                        <h5 className="shop-rating-card">
                          <img
                            className="ratingIcon"
                            src={starIcon}
                            alt="Star icon"
                          />
                          {averageRatingSupplier[shops.id]
                            ? averageRatingSupplier[shops.id]
                            : "0"}
                        </h5>
                      </React.Fragment>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Shop;
