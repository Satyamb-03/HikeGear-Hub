// AddProduct.js
import React, { useState, useEffect } from "react";
import { Form, Alert, InputGroup, Button } from "react-bootstrap";
import ProductService from "./ProductService";
import { useNavigate } from 'react-router-dom';
import { uploadImage } from './uploadImage';

function AddProduct({ id, setProductId }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [moreImages, setMoreImages] = useState([]);
  const [newArrival, setNewArrival] = useState(false);
  const [message, setMessage] = useState({ error: false, msg: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      name === "" ||
      description === "" ||
      fullDescription === "" ||
      pricePerDay === "" ||
      !image ||
      category === ""
    ) {
      setMessage({ error: true, msg: "All fields are mandatory!" });
      return;
    }

    try {
      let imageUrl = await uploadImage(image);
      let moreImageUrls = await Promise.all(
        moreImages.map((img) => uploadImage(img))
      );

      const newProduct = {
        name,
        description,
        fullDescription,
        pricePerDay: parseInt(pricePerDay, 10), // Store as integer
        image: imageUrl,
        moreImages: moreImageUrls,
        newArrival,
        category
      };

      if (id) {
        await ProductService.updateProduct(id, newProduct);
        setProductId("");
        setMessage({ error: false, msg: "Product updated successfully!" });
      } else {
        await ProductService.addProduct(newProduct);
        setMessage({ error: false, msg: "New product added successfully!" });
      }

      navigate('/');
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }

    setName("");
    setDescription("");
    setFullDescription("");
    setPricePerDay("");
    setCategory("");
    setImage(null);
    setMoreImages([]);
    setNewArrival(false);
  };

  const editHandler = async () => {
    setMessage("");
    try {
      const docSnap = await ProductService.getProduct(id);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setDescription(data.description);
        setFullDescription(data.fullDescription);
        setPricePerDay(data.pricePerDay); // Handle as integer
        setImage(data.image);
        setMoreImages(data.moreImages);
        setNewArrival(data.newArrival);
        setCategory(data.category || "");
      } else {
        setMessage({ error: true, msg: "Product not found" });
      }
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
  };

  useEffect(() => {
    if (id) {
      editHandler();
    }
  }, [id]);

  const categories = ['Clothing', 'Footwear', 'Gear', 'Accessories'];

  return (
    <div className="p-4 box">
      {message?.msg && (
        <Alert
          variant={message?.error ? "danger" : "success"}
          dismissible
          onClose={() => setMessage("")}
        >
          {message?.msg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formProductName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductDescription">
          <Form.Label>Short Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductFullDescription">
          <Form.Label>Full Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Full Description"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductPrice">
          <Form.Label>Price Per Day</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Price Per Day"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
            />
            <InputGroup.Text>/day</InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductImage">
          <Form.Label>Main Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductMoreImages">
          <Form.Label>Additional Images</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setMoreImages(Array.from(e.target.files))}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProductNewArrival">
          <Form.Check
            type="checkbox"
            label="New Arrival"
            checked={newArrival}
            onChange={(e) => setNewArrival(e.target.checked)}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            {id ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddProduct;
