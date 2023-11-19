import React, { useState, useEffect } from "react";
import { Setting_ser } from "../_services/_settings";
import { useHistory } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import { Button, Form, Modal, Card, Table, InputGroup, FormControl, Accordion, Container, Row, Col } from "react-bootstrap";
import "./styles.css";

const loaderClass = {
  position: "fixed",
  background: "#fff",
  width: "100%",
  zIndex: "11111",
  top: "0",
  height: "100%",
  textAlign: "center",
};

function Settings() {
  const [spinner, setSpinner] = useState(true);
  const [topImage, setTopImage] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    Setting_ser.getSettings().then(
        (data) => {
          if (data && data.data) {
            setTopImage(data.data.top_image || {});
            setSocialLinks(data.data.social_link || {});
            setSliders(data.data.sliders ? [].concat(...data.data.sliders) : []);
            setSpinner(false);
          } else {
            console.log('');
            setSpinner(false);
          }
        },
        (err) => {
          console.log(err);
        }
    );
  }, []);

  const handleTopImageSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newTopImage = {
      img: formData.get('topImage'),
      link: formData.get('topImageLink'),
    };
    let token = JSON.parse(localStorage.getItem("token"));
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    };

    fetch('http://localhost:8080/settings/update-top-image', {
      method: 'POST',
      headers: header.headers,
      body: JSON.stringify(newTopImage),
    })
        .then((response) => response.json())
        .then(() => {
          alert("succesfully saved");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const handleSocialLinksSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newSocialLinks = {
      facebook: formData.get('facebookLink'),
      twitter: formData.get('twitterLink'),
      youtube: formData.get('youtubeLink'),
    };
    let token = JSON.parse(localStorage.getItem("token"));
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    };

    fetch('http://localhost:8080/settings/update-social-links', {
      method: 'POST',
      headers: header.headers,
      body: JSON.stringify(newSocialLinks),
    })
        .then((response) => response.json())
        .then(() => {
          alert("succesfully saved");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const handleSlidersSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newSlider = {
      to: formData.getAll('sliderLink'),
      img: formData.getAll('sliderImage'),
      title: formData.getAll('sliderTitle'),
      description: formData.getAll('sliderDescription'),
    };

    const sliderCount = Math.max(
        newSlider.to.length,
        newSlider.img.length,
        newSlider.title.length,
        newSlider.description.length
    );

    const updatedSliders = [];

    for (let i = 0; i < sliderCount; i++) {
      const slider = {
        to: newSlider.to[i] || '',
        img: newSlider.img[i] || '',
        title: newSlider.title[i] || '',
        description: newSlider.description[i] || '',
      };
      updatedSliders.push(slider);
    }

    if (updatedSliders.length === 0) {
      alert("Please fill in at least one set of fields to add a slider.");
      return;
    }

    let token = JSON.parse(localStorage.getItem("token"));
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    };

    fetch('http://localhost:8080/settings/update-sliders', {
      method: 'POST',
      headers: header.headers,
      body: JSON.stringify({ sliders: updatedSliders }),
    })
        .then((response) => response.json())
        .then(() => {
          alert("Successfully saved");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
  };


  /*const transformSlidersData = (data) => {
    const transformedData = [];

    data.forEach((slider) => {
      const sliderCount = Math.max(
          slider.to.length,
          slider.img.length,
          slider.title.length,
          slider.description.length
      );

      for (let i = 0; i < sliderCount; i++) {
        const newSlider = {
          to: slider.to[i] || '',
          img: slider.img[i] || '',
          title: slider.title[i] || '',
          description: slider.description[i] || '',
        };
        transformedData.push(newSlider);
      }
    });

    return transformedData;
  };*/





  return (
      <>
        {spinner ? (
            <div style={loaderClass}>
              <img src={require("assets/img/loading.gif").default} />
            </div>
        ) : (
            ""
        )}
        <Container fluid>
          <Row>
            <Col md="12">
              <Card className="">
                <Card.Body>
                  <Accordion defaultActiveKey="1">
                    <Card>
                      <Accordion.Toggle as={Button} variant="block btn-primary" eventKey="0">
                        Top Image
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <form onSubmit={handleTopImageSubmit}>
                            <Row>
                              <Col lg="6">
                                <Form.Group>
                                  <Form.Label> Top Advert Image Link </Form.Label>
                                  <Form.Control type="text" name="topImageLink" defaultValue={topImage.link} />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Top Advert Image URL </Form.Label>
                                  <Form.Control type="text" name="topImage" defaultValue={topImage.img} />
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Button
                                    type="submit"
                                    className="btn btn-success btn-block"
                                    style={{ background: "#87CB16", color: "#fff" }}
                                >
                                  Update Top Image
                                </Button>
                              </Col>
                            </Row>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>

                  <Accordion defaultActiveKey="1">
                    <Card>
                      <Accordion.Toggle as={Button} variant="block btn-primary" eventKey="0">
                        Social Media
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <form onSubmit={handleSocialLinksSubmit}>
                            <Row>
                              <Col lg="12">
                                <InputGroup className="mb-2">
                                  <InputGroup.Prepend>
                                    <InputGroup.Text>
                                      <i className="fab fa-facebook" />
                                    </InputGroup.Text>
                                  </InputGroup.Prepend>
                                  <FormControl name="facebookLink" defaultValue={socialLinks.facebook} placeholder="Add Facebook Link" />
                                </InputGroup>

                                <InputGroup className="mb-2">
                                  <InputGroup.Prepend>
                                    <InputGroup.Text>
                                      <i className="fab fa-twitter" />
                                    </InputGroup.Text>
                                  </InputGroup.Prepend>
                                  <FormControl name="twitterLink" defaultValue={socialLinks.twitter} placeholder="Add Twitter Link" />
                                </InputGroup>

                                <InputGroup className="mb-2">
                                  <InputGroup.Prepend>
                                    <InputGroup.Text>
                                      <i className="fab fa-youtube" />
                                    </InputGroup.Text>
                                  </InputGroup.Prepend>
                                  <FormControl name="youtubeLink" defaultValue={socialLinks.youtube} placeholder="Add YouTube Link" />
                                </InputGroup>
                              </Col>

                              <Col lg="12">
                                <Button
                                    type="submit"
                                    className="btn btn-success btn-block"
                                    style={{ background: "#87CB16", color: "#fff" }}
                                >
                                  Update Social Links
                                </Button>
                              </Col>
                            </Row>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>

                  <Accordion defaultActiveKey="1">
                    <Card>
                      <Accordion.Toggle as={Button} variant="block btn-primary" eventKey="0">
                        Sliders
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <form onSubmit={handleSlidersSubmit}>
                            <Row>
                              <Col lg="6">
                                <Form.Group>
                                  <Form.Label> Slider Link </Form.Label>
                                  <Form.Control type="text" name="sliderLink" placeholder="Slider Link" />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Slider Image </Form.Label>
                                  <Form.Control type="text" name="sliderImage" placeholder="Slider Image URL" />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Slider Title </Form.Label>
                                  <Form.Control type="text" name="sliderTitle" placeholder="Slider Title" />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Slider Description </Form.Label>
                                  <Form.Control type="text" name="sliderDescription" placeholder="Slider Description" />
                                </Form.Group>
                              </Col>
                              <Col lg="6">
                                <Form.Group>
                                  <Form.Label> Slider Link </Form.Label>
                                  <Form.Control type="text" name="sliderLink" placeholder="Slider Link" />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Slider Image </Form.Label>
                                  <Form.Control type="text" name="sliderImage" placeholder="Slider Image URL" />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Slider Title </Form.Label>
                                  <Form.Control type="text" name="sliderTitle" placeholder="Slider Title" />
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label> Slider Description </Form.Label>
                                  <Form.Control type="text" name="sliderDescription" placeholder="Slider Description" />
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Button
                                    type="submit"
                                    className="btn btn-success btn-block"
                                    style={{ background: "#87CB16", color: "#fff" }}
                                >
                                  Add Slider
                                </Button>
                              </Col>
                            </Row>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
  );
}

export default Settings;
