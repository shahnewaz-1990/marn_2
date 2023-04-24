import React, { useEffect, useState, useRef } from "react";
import "./sellerProfile.css";
import { Form, Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SellerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImages] = useState([]);
  const [userAvatar, setUserAvatar] = useState("");
  const fileInputRef = useRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    const data = new FormData();
    data.append("email", location.state.email);
    data.append("", selectedFile);
    axios.post("/user/changeProfile", data).then((response) => {
      setUserAvatar(response.data.avatar);
    });
    // handle the selected file here
  };
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Product 1",
      description: "This is the description for product 1",
      price: "$10.00",
      sold: 5,
    },
    {
      id: 2,
      title: "Product 2",
      description: "This is the description for product 2",
      price: "$15.00",
      sold: 10,
    },
    {
      id: 3,
      title: "Product 3",
      description: "This is the description for product 3",
      price: "$20.00",
      sold: 15,
    },
  ]);

  useEffect(() => {
    axios
      .post("/seller/getProducts", { userId: location.state.id })
      .then((response) => {
        setProducts(response.data);
      });
    axios
      .post("/user/getSeller", {
        email: location.state.email,
        password: location.state.password,
      })
      .then((response) => {
        setUserAvatar(response.data.avatar);
      });
  }, [location.state.id, location.state, userAvatar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("price", price);
    data.append("userId", location.state.id);
    Array.from(image).forEach((img) => {
      data.append("image", img);
    });
    axios.post("/seller/product", data).then(() => {
      axios
        .post("/seller/getProducts", { userId: location.state.id })
        .then((response) => {
          setProducts(response.data);
        });
    });
    setTitle("");
    setDescription("");
    setPrice("");
    setImages([]);
  };

  const handleSetSold = (id, isSold) => {
    axios.patch("/seller/setSold", { id, isSold }).then(() => {
      axios
        .post("/seller/getProducts", { userId: location.state.id })
        .then((response) => {
          setProducts(response.data);
        });
    });
  };

  return (
    <div>
      <div className="container bootstrap snippets bootdey">
        <div className="col-md-12">
          <div className="profile-container">
            <div
              style={{ paddingBottom: 30, position: "relative" }}
              className="profile-header row"
            >
              <div className="col-md-4 col-sm-12 text-center">
                <div
                  style={{
                    margin: "10px",
                    position: "absolute",
                    right: 5,
                    zIndex: 1,
                  }}
                >
                  <Button onClick={() => navigate("/login")}>Logout</Button>
                </div>
                <img
                  src={
                    userAvatar
                      ? userAvatar
                      : "https://bootdey.com/img/Content/user_1.jpg"
                  }
                  alt=""
                  className="header-avatar"
                />
                <div>
                  <Button onClick={handleClick}>Change Profile Picture</Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
              <div className="col-md-8 col-sm-12 profile-info">
                <div className="header-fullname">{`${location.state.name} ${location.state.lastName}`}</div>

                <div className="header-information">{location.state.email}</div>
              </div>
            </div>
          </div>
        </div>
        <Form style={{ margin: 20 }} onSubmit={handleSubmit}>
          <h3>Upload A Product</h3>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              required
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setImages(files);
              }}
            />
          </Form.Group>

          <Button style={{ marginTop: 10 }} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <h3>Your Products</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <Button
                    onClick={() => handleSetSold(product._id, product.sold)}
                  >
                    {product.sold ? "Set as Not Sold" : "Set as Sold"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SellerProfile;
