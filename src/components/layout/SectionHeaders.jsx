import React from "react";

const SectionHeaders = ({ subHeader, mainHeader }) => {
  return (
    <div className="text-center mb-8">
      {subHeader && (
        <h3 className="uppercase text-gray-400 font-semibold text-sm mb-2">
          {subHeader}
        </h3>
      )}
      <h2 className="text-primary font-extrabold text-5xl leading-tight">
        {mainHeader}
      </h2>
    </div>
  );
};

export default SectionHeaders;
