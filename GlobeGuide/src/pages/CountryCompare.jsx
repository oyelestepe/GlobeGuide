import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from 'react-router-dom';
import './pagesCss/CountryCompare.css';

const geoUrl = "/data/worldmap.geojson";

function CountryCompare() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handleCountryClick = (geo) => {
    const countryCode = geo.properties.ISO_A3 || geo.properties.cca3 || geo.id;
    if (selected.length === 0) {
      setSelected([countryCode]);
    } else if (selected.length === 1 && countryCode !== selected[0]) {
      setSelected([selected[0], countryCode]);
      setTimeout(() => {
        navigate(`/compare?c1=${selected[0]}&c2=${countryCode}`);
        setSelected([]);
      }, 500);
    }
  };

  return (
    <div className="country-compare-root">
      <h2 className="country-compare-title">Select two countries to compare</h2>
      <div className="country-compare-instruction">
        Click on two countries on the map below to see a detailed comparison.
      </div>
      <div className="country-compare-map-wrapper">
        <ComposableMap projection="geoEqualEarth">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const countryCode = geo.properties.ISO_A3 || geo.properties.cca3 || geo.id;
                const isSelected = selected.includes(countryCode);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? "#57cc99" : "#EAEAEC",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: "pointer"
                      },
                      hover: {
                        fill: "#b7e4c7",
                        stroke: "#FFFFFF",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: "#38b000",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div className="country-compare-selected">
        {selected.length === 1 && <span>Now select another country to compare with <b>{selected[0]}</b>.</span>}
      </div>
    </div>
  );
}

export default CountryCompare;