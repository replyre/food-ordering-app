export default function AddToCartButton({
  hasSizesOrExtras,
  onClick,
  basePrice,
  className = "",
}) {
  return (
    <div className={`mt-4 ${className}`}>
      {" "}
      {hasSizesOrExtras ? (
        <button
          type="button"
          onClick={onClick}
          className="bg-primary text-white rounded-full px-8 py-2 w-full"
        >
          <span>Add to cart (from ₹{basePrice})</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="bg-primary text-white rounded-full px-8 py-2 w-full"
        >
          <span>Add to cart ₹{basePrice}</span>
        </button>
      )}
    </div>
  );
}
