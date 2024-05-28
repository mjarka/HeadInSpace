import React from "react";

export default function Slider({
  description,
  onChange,
  value,
  min,
  max,
  step = 0.01,
}) {
  return (
    <div className="flex items-center space-x-4">
      {" "}
      {/* Flex container with horizontal spacing */}
      <p className="shrink-0">{description}</p>{" "}
      {/* Prevent the text from shrinking */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full cursor-pointer"
      />
    </div>
  );
}
