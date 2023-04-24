import { Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

import { useState, useEffect } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";
import axios from "axios";

const UsersPageComponent = ({ fetchUsers, deleteUser }) => {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [userDeleted, setUserDeleted] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const dispatch = useDispatch();

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure?")) {
      const data = await deleteUser(userId);
      if (data === "user removed") {
        setUserDeleted(!userDeleted);
      }
    }
  };

  useEffect(() => {
    const abctrl = new AbortController();
    fetchUsers(abctrl)
      .then((res) => setUsers(res))
      .catch(
        (er) => dispatch(logout())
        // console.log(
        //   er.response.data.message ? er.response.data.message : er.response.data
        // )
      );
    axios.get("/user/getAllUsers").then((response) => {
      setSellers(response.data);
    });

    return () => abctrl.abort();
  }, [userDeleted]);

  const handleSellerDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete("/user/deleteSeller", { data: { id } }).then(() => {
        setUserDeleted(!userDeleted);
      });
    }
  };

  const handleEditSubmit = () => {
    axios.put("/user/editSeller", { id, name, lastName, email }).then(() => {
      setUserDeleted(!userDeleted);
      setShowModal(false);
    });
  };

  console.log(sellers);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>My Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="m-5">
        <Col md={2}>
          <AdminLinksComponent />
        </Col>
        <Col md={10}>
          <h1>User List</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Is Admin</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <i className="bi bi-check-lg text-success"></i>
                    ) : (
                      <i className="bi bi-x-lg text-danger"></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/edit-user/${user._id}`}>
                      <Button className="btn-sm">
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                    </LinkContainer>
                    {" / "}
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="bi bi-x-circle"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="m-5">
        <Col md={2}></Col>
        <Col md={10}>
          <h1>Sellers List</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                {/* <th>Is Admin</th> */}
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, i) => (
                <tr key={seller._id}>
                  <td>{i + 1}</td>
                  <td>{seller.name}</td>
                  <td>{seller.lastName}</td>
                  <td>{seller.email}</td>
                  {/* <td>
                    {seller.isAdmin ? (
                      <i className="bi bi-check-lg text-success"></i>
                    ) : (
                      <i className="bi bi-x-lg text-danger"></i>
                    )}
                  </td> */}
                  <td>
                    <Button
                      onClick={() => {
                        setShowModal(true);
                        setName(seller.name);
                        setLastName(seller.lastName);
                        setEmail(seller.email);
                        setId(seller._id);
                      }}
                      className="btn-sm"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    {" / "}
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleSellerDelete(seller._id)}
                    >
                      <i className="bi bi-x-circle"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default UsersPageComponent;
