import React from "react";

const LogoImage = ({ width = 50, height = 50, className = "" }) => {
  return (
    <div
      className={`${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 349.2 320"
        width={width}
        height={height}
      >
        <defs>
          <style>
            {`
              .cls-1 {
                fill: none;
                stroke-linejoin: round;
              }
              .cls-1, .cls-2 {
                stroke: #000;
                stroke-linecap: round;
                stroke-width: 40px;
              }
              .cls-2 {
                fill: #fff;
                stroke-miterlimit: 10;
              }
            `}
          </style>
        </defs>
        <g data-name="Layer_1">
          <line className="cls-2" x1="50" y1="270" x2="50" y2="20" />
          <line className="cls-2" x1="150" y1="120" x2="150" y2="270" />
          <line className="cls-2" x1="250" y1="20" x2="299.19" y2="265.11" />
          <circle cx="50" cy="270" r="50" />
          <circle cx="150" cy="270" r="50" />
          <circle cx="299.19" cy="265.11" r="50" />
          <polyline className="cls-1" points="50 20 150 120 250 20" />
        </g>
      </svg>
    </div>
  );
};

export default LogoImage;
