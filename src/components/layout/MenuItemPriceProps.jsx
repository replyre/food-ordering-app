import React, { useState } from "react";
import ChevronUp from "../icons/ChevronUp";
import ChevronDown from "../icons/ChevronDown";
import Trash from "../icons/Trash";
import Plus from "../icons/Plus";

const MenuItemPriceProps = ({ name, addLabel, props, setProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addProp = () => {
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0 }];
    });
  };

  const editProp = (e, index, prop) => {
    const newValue = e.target.value;
    setProps((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  };

  const removeProp = (indexToRemove) => {
    setProps((prev) => prev.filter((v, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button"
      >
        {isOpen && <ChevronUp />}

        {!isOpen && <ChevronDown />}

        <span>{name}</span>
        <span>({props.length})</span>
      </button>

      <div className={isOpen ? "block" : "hidden"}>
        {props?.length > 0 &&
          props.map((size, index) => (
            <div key={index} className="flex items-end gap-2">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Size Name"
                  value={size.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>

              <div>
                <label>Extra Price</label>
                <input
                  type="text"
                  placeholder="Extra Price"
                  value={size.price}
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => removeProp(index)}
                  className="bg-white mb-2 px-2"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}

        <button
          type="button"
          onClick={addProp}
          className="bg-white items-center"
        >
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemPriceProps;
