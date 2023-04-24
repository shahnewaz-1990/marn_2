/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/actions/cartActions";

const BuyerProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const productFetch = async () => {
      try {
        const response = await axios.get("/seller/allProducts");
        if (!response.data) throw new Error("No Products");
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    productFetch();
  }, []);

  const dispatch = useDispatch();

  return (
    <div className="py-4 container">
      <h2 className="text-center mb-4">Products</h2>
      <div
        className="row row-cols-1 
      row-cols-md-2 row-cols-lg-4 justify-content-center align-content-center"
      >
        {data.length > 0 &&
          data.map((item, index) => (
            <div key={item._id} className="m-3" style={{ width: "250px" }}>
              <div
                className="h-100 border rounded-3 shadow-sm"
                style={styles.card}
              >
                <img src={item.image} style={styles.cardImgTop} alt="..." />
                <div style={styles.cardBody}>
                  <h5 style={styles.cardTitle}>{item.title}</h5>
                  <p style={styles.cardText}>${item.price}</p>
                </div>
                <a
                  href="#!"
                  className="btn btn-primary"
                  style={styles.btnPrimary}
                  onClick={() => {
                    dispatch(addToCart(item._id, 1));
                  }}
                >
                  <i className="bi bi-cart-plus"></i>
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "250px",
    height: "auto",
    padding: "0",
    paddingHorizontal: "4px",
    position: "relative",
    border: "none",
    boxShadow: "0 1 60px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  cardImgTop: {
    width: "100%",
    height: "85%",
    objectFit: "cover",
  },
  btnPrimary: {
    position: "absolute",
    top: "10px",
    right: "10px",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    padding: "10px",
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
  },
  cardTextContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: "14px",
    margin: "0",
  },
};

export default BuyerProducts;
