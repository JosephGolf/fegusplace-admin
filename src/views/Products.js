import React, { useEffect } from "react";
import {productService} from '../_services/product_services';
import { useHistory } from 'react-router-dom';
import NotificationAlert from "react-notification-alert";
import {Button,Form,Modal,Card,Table,Container,Row,Col,} from "react-bootstrap";
import './styles.css';
const loaderClass = {
  position: 'fixed',
  background: '#fff',
  width: '100%',
  zIndex: '11111',
  top: '0',
  height: '100%',
  textAlign: 'center',
};

function Products() {
  const [products, setProducts] = React.useState([]);
  const [ spinner, setSpinner ] = React.useState(true);
  const notificationAlertRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState('');
  const [originalPrice, setOriginalPrice] = React.useState(0);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setEditProduct(product);
    setShow(true);
  };
  const handleOriginalPriceChange = (e) => {
    const newOriginalPrice = parseFloat(e.target.value) || 0;
    let calculatedFinalPrice = newOriginalPrice * 0.025;
    if (newOriginalPrice > 2500) {
      calculatedFinalPrice += 100;
    }
    setOriginalPrice(newOriginalPrice);
    setFinalPrice(calculatedFinalPrice);
  };
  // edit fields
  const [nameEn, setNameEn] = React.useState("");
  const handelDelete = (id) => {
    let cfm = confirm('Are you sure you want to delete this item?',true)
    if(cfm){
      productService.deleteProduct(id).then(
          (data)=>{
            notify();
            console.log(data);
          },
          (err)=>{
            console.log(err);
          }
      )
    }else{
      alert('Your item is safe now :)')
    }
  };
  useEffect(() => {
    productService.getAllProducts().then(
        data => {
          setProducts(data.data);
          setSpinner(false);
        },
        (err) => {
          console.log(err)
        }
    )
  },[]);
  let history = useHistory();
  const gotToAddProduct = () =>{
    history.push('/admin/addProduct')
  }
  const notify = () => {
    let type = "danger";
    let options = {};
    options = {
      place: "tc",
      message: (
          <div>
            Product has been deleted!
          </div>
      ),
      type: type,
      autoDismiss: 4,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  let handleEditSubmit = (e) =>{
    e.preventDefault();
    let id = e.target[0].value;
    let nameEn = e.target[1].value;
    let originalPrice = e.target[2].value;
    let brand = e.target[3].value;
    let discount = e.target[4].value;
    let quantity = e.target[5].value;
    let description = e.target[6].value;
    let calculatedFinalPrice = parseFloat(originalPrice) * 0.0225;
    if (parseFloat(originalPrice) > 2500) {
      calculatedFinalPrice += 100;
    }
    setOriginalPrice(parseFloat(originalPrice) || 0);
    setFinalPrice(calculatedFinalPrice);

    productService.updateProduct({
      "id":id,
      "nameEn": nameEn,
      'price': calculatedFinalPrice,
      'brand': brand,
      'discount': discount,
      'quantity': quantity,
      'description': description,
    }).then(
        (data)=>{
          alert('Your product has been updated!');
        },
        (err)=>{
          console.log(err);
        }
    )
  }


  return (
      <>
        {spinner ? <div style={loaderClass}>
              <img src={require("assets/img/loading.gif").default} />
            </div>
            : ''}
        <Container fluid>
          <Row>
            <NotificationAlert ref={notificationAlertRef} />
            <Col lg="12" className="mb-3">
              <Button onClick={gotToAddProduct} className="btn float-right btn-sm btn-outline-info">Add new <i className="fas fa-plus"></i></Button>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Products Details</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Image</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Brand</th>
                      <th className="border-0">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product,index) => <tr key={index}>
                      <td>{index+1}</td>
                      <td>{product.nameEn}</td>
                      <td><img
                          src={product.image[0]}
                          alt="..." style={{width:'100px'}}
                      /></td>
                      <td>{ product.price }</td>
                      <td>{product.brand}</td>
                      <td>
                        <Button  onClick={() => handelDelete(product._id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></Button>
                        <Button onClick={() =>handleShow(product)} className="btn btn-sm ml-1 btn-info"><i className="fa fa-pen"></i></Button>
                      </td>
                    </tr>)}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Body>
            <form onSubmit={handleEditSubmit}>
              <input disabled type="hidden" name="product_id" defaultValue={editProduct._id}/>
              <Row>
                <Col md="7">
                  <Form.Group>
                    <Form.Label> Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="nameEn"
                        placeholder="Enter product name"
                        defaultValue={editProduct.nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="text"
                        name="originalPrice"
                        placeholder="Enter product price"
                        defaultValue={editProduct.price}
                        onChange={handleOriginalPriceChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Final Price</Form.Label>
                    <Form.Control
                        type="text"
                        name="finalPrice"
                        placeholder="Final price will be calculated"
                        value={finalPrice}
                        readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Brand</Form.Label>
                    <Form.Control
                        type="text"
                        name="brand"
                        placeholder="Enter product Brand"
                        defaultValue={editProduct.brand}
                        onChange={(e) => setNameEn(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Discount</Form.Label>
                    <Form.Control
                        type="text"
                        name="discount"
                        placeholder="Enter product discount"
                        defaultValue={editProduct.discount}
                        onChange={(e) => setNameEn(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Available Quantity</Form.Label>
                    <Form.Control
                        type="text"
                        name="discount"
                        placeholder="Enter product quantity"
                        defaultValue={editProduct.quantity}
                        onChange={(e) => setNameEn(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md="5">
                  {/* <Form.Group>
            <Form.Label>Edit main image</Form.Label>
            <Form.Control
            type="text"
            name="image[0]"
            placeholder="Enter image url"
            defaultValue={editProduct.image[0]}
            />
          </Form.Group> */}
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={12}
                                  type="text"
                                  name="description"
                                  placeholder="Enter product description"
                                  defaultValue={editProduct.description}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button  variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </form>

          </Modal.Body>

        </Modal>

      </>

  );
}

export default Products;
