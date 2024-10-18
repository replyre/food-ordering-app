import { useEffect, useState } from "react";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || "");
  const [categories, setCategories] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(
    menuItem?.extraIngredientPrices || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    fetch("/api/categories").then((response) => {
      response.json().then((categories) => {
        setCategories(categories);
        if (!category && categories.length > 0) {
          setCategory(categories[0]._id);
        }
      });
    });
  }, [category]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "food-ordering-app");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          setImage(data.link);
          setImageFile(null);
        } else {
          setUploadError(data.message);
        }
      } catch (error) {
        setUploadError("Error uploading image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (!image) {
      alert("Please provide an image URL or upload a file.");
      return;
    }

    onSubmit(ev, {
      image,
      name,
      description,
      basePrice,
      sizes,
      extraIngredientPrices,
      category,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div
        className="md:grid items-start gap-4"
        style={{ gridTemplateColumns: "1fr 2fr" }}
      >
        <div className="flex flex-col items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Menu item"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300 mb-4"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-gray-400 border border-gray-300 rounded-lg mb-4">
              No Image
            </div>
          )}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(ev) => setImage(ev.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700 sm:text-sm"
              placeholder="Enter image URL"
            />
            <div className="mt-4 text-gray-500">or</div>
            <div className="mt-4 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="file-upload"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 text-center cursor-pointer"
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </label>
            </div>
            {uploadError && (
              <div className="text-red-600 mt-2">{uploadError}</div>
            )}
          </div>
        </div>
        <div className="grow">
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700 sm:text-sm"
            placeholder="Enter item name"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Description
          </label>
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700 sm:text-sm"
            placeholder="Enter description"
            rows={4}
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Category
          </label>
          <select
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700 sm:text-sm"
          >
            {categories?.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Base Price
          </label>
          <input
            type="text"
            value={basePrice}
            onChange={(ev) => setBasePrice(ev.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700 sm:text-sm"
            placeholder="Enter base price"
          />
          <MenuItemPriceProps
            name={"Sizes"}
            addLabel={"Add item size"}
            props={sizes}
            setProps={setSizes}
          />
          <MenuItemPriceProps
            name={"Extra Ingredients"}
            addLabel={"Add ingredients prices"}
            props={extraIngredientPrices}
            setProps={setExtraIngredientPrices}
          />
          <button
            type="submit"
            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
