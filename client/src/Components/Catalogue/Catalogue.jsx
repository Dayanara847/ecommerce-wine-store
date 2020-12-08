import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { productsList } from "./Info";
import './Catalogue.modules.css'

function Catalogue() {
  return (
    <div className='Catalogue__Div' >
      {productsList.map((product, index) => {
        return <ProductCard data={product} key={index} />;
      })}
    </div>
  );
}

export default Catalogue;
