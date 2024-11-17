import React, { useState, useEffect } from "react";

const StoreAisle = () => {
  const [marker, setMarker] = useState(null); // Store a single marker
  const aisleCoordinates = [
    {
      aisle: "Aisle 1",
      points:
        "296.234 298.249 332.507 318.401 357.697 332.507 378.857 337.545 398.001 345.606 426.214 357.697 419.16 388.933 378.857 361.727 357.697 355.682 336.538 341.576 261.975 284.142 237.793 270.036 227.717 328.477 244.846 301.272 273.059 319.408 298.249 330.492 250.892 340.568 279.104 352.659 301.272 361.727 325.454 375.834 362.735 394.978 391.955 407.069 415.13 421.176",
    },
    {
      aisle: "Aisle 2",
      points:
        "414.122 222.679 386.917 210.588 362.735 199.504 441.328 236.785 473.571 251.899 511.859 273.059 541.08 286.158 546.118 321.424 509.844 305.302 478.609 290.188 443.343 262.983 407.069 248.877 368.781 223.687 365.758 258.953 387.925 273.059 425.206 289.18 459.464 308.325 495.738 327.469 540.072 341.576",
    },
    {
      aisle: "Aisle 3",
      points:
        "568.285 168.269 537.049 148.117 494.73 133.003 601.536 188.421 645.87 201.519 680.128 222.679 673.075 247.869 640.832 232.755 606.574 218.649 578.361 200.512 548.133 181.368 507.829 167.261 507.829 199.504 550.148 217.641 593.475 240.816 625.718 254.922 656.953 269.029 679.121 280.112",
    },
    // {
    //   aisle: "Aisle 4",
    //   points:
    //     "655.946 76.5774 615.642 55.4179 574.331 36.2735 687.181 92.699 724.462 108.821 759.728 127.965 805.07 151.14 804.063 184.39 757.713 160.208 705.318 129.98 659.976 109.828 613.627 79.6002 568.285 61.4634 570.3 91.6914 614.634 111.843 651.915 128.972 692.219 151.14 757.713 182.375 803.055 206.557",
    // },
    {
      aisle: "Aisle 5",
      points:
        "100.76 251.899 49.3723 275.074 135.018 235.778 174.314 217.641 219.656 192.451 264.998 179.352 295.226 157.185 341.576 139.048 368.781 126.957 411.1 103.783 433.267 93.7066 421.176 128.972 386.917 146.102 323.439 172.299 294.218 188.421 255.93 205.55 216.633 222.679 161.216 253.915 92.699 276.082 427.221 66.5014 362.735 97.7369 291.196 135.018 254.922 155.17 213.611 170.284 158.193 198.497 119.904 213.611 87.661 227.717 61.4634 247.869",
    },
  ];

  // Function to get a random position on an aisle's polygon
  const getRandomPosition = (points) => {
    const coords = points.split(" ").map(Number);
    const randomIndex = Math.floor(Math.random() * (coords.length / 2));
    return { x: coords[randomIndex * 2], y: coords[randomIndex * 2 + 1] };
  };

  // Generate a random marker on initial render
  useEffect(() => {
    const randomAisleIndex = Math.floor(
      Math.random() * aisleCoordinates.length
    ); // Pick a random aisle
    const selectedAisle = aisleCoordinates[randomAisleIndex];
    const randomPosition = getRandomPosition(selectedAisle.points);
    setMarker(randomPosition); // Set the marker state to a random position on the selected aisle
  }, []); // Empty dependency array ensures this runs only on initial render

  return (
    <div>
      
      <svg
        style={{ width: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1061 604"
      >
        <style>
          {`
            .image-mapper-shape {
              fill: rgba(0, 0, 0, 0);
            }
            g:hover .image-mapper-shape {
              stroke: white;
              stroke-width: 2px;
              opacity: 20%;
            }

            /* Animation for marker */
/* Animation for marker */
.marker, .marker-image {
  animation: fadeInFromTop 1s ease-in-out;
}

@keyframes fadeInFromTop {
  0% {
    opacity: 0;
    transform: translateY(-20px); /* Start from above the original position */
  }
  100% {
    opacity: 1;
    transform: translateY(0); /* End at the original position */
  }
}
/* Animation for marker wobbling */
 .marker-image {
  animation: wobble 5s ease-in-out infinite; /* 5s duration, repeat infinitely */
}

@keyframes wobble {
  0% {
    transform: translateX(0) translateY(0); /* Initial position */
  }
  25% {
    transform: translateY(10px) translateY(-50px); /* Move slightly right and up */
  }
  50% {
    transform: translateY(-5px) translateY(5px); /* Move slightly left and down */
  }
  75% {
    transform: translateY(5px) translateY(-50px); /* Repeat the slight right and up movement */
  }
  100% {
    transform: translateY(0) translateY(0); /* End back at the original position */
  }
}


          `}
        </style>

        <image xlinkHref="../map.png" style={{ width: "100%" }} />

        {/* Render Aisles */}
        {aisleCoordinates.map(({ aisle, points }) => (
          <a href="#" key={aisle} title={aisle}>
            <g>
              <polygon className="image-mapper-shape" points={points} />
            </g>
          </a>
        ))}

        {/* Render a single marker */}
        {marker && (
          <g>
            {/* Custom Marker Image */}
            <image
              className="marker-image"
              xlinkHref="../marker.png" // Path to your custom marker image
              x={marker.x - 75} // Adjust x to center the image above the red circle
              y={marker.y - 150} // Adjust y to place the image above the red circle
              width="150"
              height="150"
            />
            {/* Red Circle Marker */}
            <circle
              className="marker"
              cx={marker.x}
              cy={marker.y}
              r="10" // Increase the radius (size of the circle)
              fill="red"
              style={{ opacity: 0.7, transition: "all 0.3s ease" }} // Lower opacity and transition effect
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default StoreAisle;
