import { useState } from "react";
import { toast } from "react-toastify";
import { addMenuItem } from "../services/menuService";

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    ingredients: "",
    allergens: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data
      const menuItemData = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
        allergens: formData.allergens.split(",").map((item) => item.trim()),
      };

      const result = await addMenuItem(menuItemData);

      if (result.success) {
        toast.success("Menu item added successfully!");
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          image: "",
          ingredients: "",
          allergens: "",
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding menu item");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-item-page">
      <h1>Add Menu Item</h1>
      <form onSubmit={handleSubmit} className="menu-item-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Main Courses">Main Courses</option>
            <option value="Sides">Sides</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients (comma separated)</label>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="e.g. Tomato, Cheese, Basil"
          />
        </div>

        <div className="form-group">
          <label htmlFor="allergens">Allergens (comma separated)</label>
          <input
            type="text"
            id="allergens"
            name="allergens"
            value={formData.allergens}
            onChange={handleChange}
            placeholder="e.g. Gluten, Dairy, Nuts"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;
