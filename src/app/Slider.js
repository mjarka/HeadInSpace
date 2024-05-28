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
    <>
      <input
        type="range"
        min={min}
        description={description}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full cursor-pointer"
      />
      <p>{description}</p>
    </>
  );
}
