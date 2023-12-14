import React, { useEffect } from "react";
import { userService } from "_services/user.services";
import NotificationAlert from "react-notification-alert";
import {
  Badge,
  Button,
  Form,
  Card,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { data, event } from "jquery";
import { productService } from "_services/product_services";
import { Cats_services } from "_services/cats_services";
import axios from "axios";

function AddProduct() {
  const [nameEn, setNameEn] = React.useState("");
  const [nameAr, setNameAr] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [brand, setBrand] = React.useState("");
  /*const [price, setPrice] = React.useState(0);*/
  const [originalPrice, setOriginalPrice] = React.useState(0);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [image, setImage] = React.useState([""]);
  const [product_cat, setProduct_cat] = React.useState({ main: "", sub: "",type:"" });
  const [products, setProducts] = React.useState([]);
  const [submited, setSubmited] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const notify = () => {
    var type = "success";
    var options = {};
    options = {
      place: "tc",
      message: (
        <div>
          <div>the User You Add Is Success</div>
        </div>
      ),
      type: type,
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const [cats, setCats] = React.useState([]);

  // selecting tree
  const [selectedCats, setselectedCats] = React.useState([]);
  const [selectedSubCatArr, setSelectedSubCatArr] = React.useState([]);

  useEffect(() => {       
    Cats_services.getAllCats().then(
      data => {            
        setCats(data.data);         
        localStorage.setItem('cats', JSON.stringify(data.data))        
      },
      (err) => {
        console.log(err)
      }
    )
  },[]);

  const handelAddImage = () => {
    setImage([...image, ""]);
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    setSubmited(true);
    const newImage = image.filter((img) => {
      return img !== "";
    });    
    setImage(newImage);
    if (
      (nameEn,
      nameAr,
      finalPrice,
      discount,
      description,
      brand,
      quantity,
      image,
      product_cat)
    ) {
      const product = {
        nameEn,
        nameAr,
        finalPrice,
        discount,
        description,
        brand,
        quantity,
        image,
        product_cat,
      };

      productService.createProduct(product);
      console.log(product);
    }
  };

  let handelCatSelect = (e) =>{
    let allCatsArr = JSON.parse(localStorage.getItem("cats"));
    for(let i=0; i<allCatsArr.length; i++){
      if(allCatsArr[i].nameEn == e.target.value){
        setselectedCats(allCatsArr[i].subCategory);  
      }
    }    
  }


  let handleSubCatSelct = (e) =>{    
    let allCatsArr = JSON.parse(localStorage.getItem("cats"));
    for(let i=0; i<allCatsArr.length; i++){
      var newArr = allCatsArr[i].subCategory.filter(x => x.subCatName === e.target.value).map(x => x.subCatArray);     
      if(newArr.length != 0){
        setSelectedSubCatArr(newArr[0]);
        setProduct_cat({...product_cat,sub:e.target.value});
         console.log(newArr[0]);
      }
      
  }
}
  const handleOriginalPriceChange = (e) => {
    const newOriginalPrice = parseFloat(e.target.value) || 0;
    setOriginalPrice(newOriginalPrice);
    const calculatedFinalPrice = calculateFinalPrice(newOriginalPrice);
    setFinalPrice(calculatedFinalPrice);
  };
  const calculateFinalPrice = (originalPrice) => {
    let calculatedFinalPrice = originalPrice * 0.025;
    if (originalPrice > 2500) {
      calculatedFinalPrice += 100;
    }
    return calculatedFinalPrice;
  };

  return (
    <Container>
      <Form>
        <Row>
          <Col lg="8">
            <Card style={{ padding: 10 }}>
              <NotificationAlert ref={notificationAlertRef} />
              <Form.Group>
                <Form.Label> Prodcut nameEn</Form.Label>
                <Form.Control
                  type="text"
                  name="nameEn"
                  placeholder="Enter product name"
                  onChange={(e) => setNameEn(e.target.value)}
                />
                <Form.Text
                  className={submited && !nameEn ? "text-danger" : "d-none"}
                >
                  Product name is required.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut nameAr</Form.Label>
                <Form.Control
                  type="text"
                  name="nameAr"
                  placeholder="Enter product nameAr"
                  onChange={(e) => setNameAr(e.target.value)}                  
                />
                <Form.Text
                  className={submited && !nameAr ? "text-danger" : "d-none"}
                >
                  Product nameAr is required.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Enter product quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Form.Text
                  className={submited && !quantity ? "text-danger" : "d-none"}
                >
                  Product nameAr is required.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  placeholder="Enter product brand"
                  onChange={(e) => setBrand(e.target.value)}
                />
                <Form.Text
                  className={submited && !brand ? "text-danger" : "d-none"}
                >
                  Product nameAr is required.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut price</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  placeholder="Enter product price"
                  /*onChange={(e) => setPrice(e.target.value)}*/
                  onChange={handleOriginalPriceChange}
                />
                <Form.Text
                  className={submited && !originalPrice ? "text-danger" : "d-none"}
                >
                  Product nameAr is required.
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Final Price</Form.Label>
                <Form.Control
                    type="text"
                    name="finalPrice"
                    value={finalPrice}
                    readOnly
                />
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut discount</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  placeholder="Enter product discount"
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <Form.Text
                  className={submited && !discount ? "text-danger" : "d-none"}
                >
                  Product nameAr is required.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Enter product description"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Form.Text
                  className={
                    submited && !description ? "text-danger" : "d-none"
                  }
                >
                  Product nameAr is required.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label> Prodcut Image</Form.Label>
                {image.map((img, index) => (
                  <Form.Control
                    key={index}
                    id={index}
                    className="mb-3"
                    type="text"
                    name="image"
                    placeholder={"Enter product Image url -" + (index + 1)}
                    onBlur={(e) => {
                      const newImages = [...image];
                      newImages[index] = e.target.value;
                      setImage(newImages);
                    }}
                  />
                ))}
                <Button onClick={handelAddImage}>Add Image</Button>
                <Form.Text
                  className={submited && !image ? "text-danger" : "d-none"}
                >
                  Product image is required.
                </Form.Text>
              </Form.Group>
            </Card>
          </Col>

          <Col lg="4">
            <h4>Category</h4>

            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Category Name</Form.Label>
              <Form.Control as="select" custom onChange={(e)=>{handelCatSelect(e);setProduct_cat({...product_cat,main:e.target.value}) }}>
                <option disabled selected>- Choose a Category Name -</option>
                {cats.map((item,index) => <><option value={item.nameEn} key={index}>{item.nameEn}</option></>)}           
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Sub Cateogry</Form.Label>
              <Form.Control as="select" custom onChange={handleSubCatSelct}>    
              <option disabled selected>- Choose a sub cat -</option>            
                {selectedCats.map((item,index) => <><option value={item.subCatName} key={index}>{item.subCatName}</option></>)}           
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>sub cats</Form.Label>
              <Form.Control as="select" custom onChange={(e)=>setProduct_cat({...product_cat,type:e.target.value})}>    
              <option disabled selected>- Choose a sub cat arr -</option>            
                {selectedSubCatArr.map((item,index) => <><option value={item} key={index}>{item}</option></>)}           
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <Button
              variant="primary"
              className="btn btn-block"
              type="submit"
              onClick={handelSubmit}
            >
              Add Product
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddProduct;
