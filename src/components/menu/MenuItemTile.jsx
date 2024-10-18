import AddToCartButton from "@/components/menu/AddToCartButton";

export default function MenuItemTile({ onAddToCart, ...item }) {
  const { image, description, name, basePrice, sizes, extraIngredientPrices } =
    item;
  const hasSizesOrExtras =
    sizes?.length > 0 || extraIngredientPrices?.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm group hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="relative flex-grow">
        <img
          src={image}
          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          alt={name}
        />
      </div>
      <div className="p-4 flex-grow">
        <h4 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      </div>
      <div className="flex justify-center mb-2">
        <AddToCartButton
          image={image}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
          basePrice={basePrice}
          className="w-64"
        />
      </div>
    </div>
  );
}
