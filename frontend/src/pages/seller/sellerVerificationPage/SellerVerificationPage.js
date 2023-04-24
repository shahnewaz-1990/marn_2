import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(true);
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    axios.post("/getOtp", { email: location.state.email }).then((response) => {
      setOtp(response.data.otp);
    });
  }, [location.state.email]);
  console.log(otp);
  console.log(location.state);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (code === otp) {
      axios
        .post("/user/seller", {
          email: location.state.email,
          name: location.state.name,
          lastName: location.state.lastName,
          password: location.state.password,
        })
        .then((response) => {
          if (response.status === 201) {
            navigate("/login");
          }
        });
    } else {
      console.log("notMatched");
    }
    // TODO: handle code submission
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          {showAlert && (
            <Alert
              variant="success"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              A verification code has been sent to your email.
            </Alert>
          )}
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="code">
              <Form.Label>Enter verification code:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
            <Button style={{ marginTop: 10 }} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default VerificationPage;
