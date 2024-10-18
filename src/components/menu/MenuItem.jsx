import { CartContext } from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import { useContext, useState } from "react";

export default function MenuItem(menuItem) {
  const { image, name, description, basePrice, sizes, extraIngredientPrices } =
    menuItem;

  console.log("MenuItem", menuItem);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowPopup(false);
  }

  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="my-8 bg-white p-6 rounded-xl max-w-lg w-full shadow-lg"
          >
            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <Image
                src={image}
                alt={name}
                width={400}
                height={300}
                className="mx-auto rounded-lg object-cover"
              />
              <h2 className="text-3xl font-bold text-center mt-4 mb-3 text-gray-800">
                {name}
              </h2>
              <p className="text-center text-gray-500 text-sm mb-5">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-600 font-semibold">
                    Pick your size
                  </h3>
                  <div className="flex flex-col gap-2 mt-3">
                    {sizes.map((size) => (
                      <label
                        key={size._id}
                        className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      >
                        <input
                          type="radio"
                          onChange={() => setSelectedSize(size)}
                          checked={selectedSize?.name === size.name}
                          name="size"
                        />
                        <span className="text-gray-700">{size.name}</span>
                        <span className="ml-auto font-semibold text-gray-800">
                          ₹{basePrice + size.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-3">
                  <h3 className="text-center text-gray-600 font-semibold">
                    Any extras?
                  </h3>
                  <div className="flex flex-col gap-2 mt-2">
                    {extraIngredientPrices.map((extraThing) => (
                      <label
                        key={extraThing._id}
                        className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      >
                        <input
                          type="checkbox"
                          onChange={(ev) =>
                            handleExtraThingClick(ev, extraThing)
                          }
                          checked={selectedExtras
                            .map((e) => e._id)
                            .includes(extraThing._id)}
                          name={extraThing.name}
                        />
                        <span className="text-gray-700">{extraThing.name}</span>
                        <span className="ml-auto font-semibold text-gray-800">
                          +₹{extraThing.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <button
                className="w-full bg-primary text-white mt-5 p-3 rounded-lg hover:bg-primary-dark transition"
                onClick={handleAddToCartButtonClick}
              >
                Add to cart ₹{selectedPrice}
              </button>
              <button
                className="w-full mt-4 text-center text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem} />
    </>
  );
}
