import React, { useEffect, useState } from 'react';
import './Sidebar.modules.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { getCategoryList, getProductsCategory } from '../../actions';
import { Button } from '@material-ui/core';

function Sidebar(props) {
  // cuando este lista las relaciones  de la DB, esta funcion debe pisar el estado 'List'
  //con el array de objetos devueltos. para que el map haga el render

  function categoria(e) {
    let categoryName = e.target.innerText;
    props.getProductsCategory(categoryName);

  }

  // console.log('paso 1',props.categories)
  if (props.categories[0] !== undefined) {
    // console.log('paso 2',props.categories)
    if(props.categories[0].length === 0){
      return(
        <div className="Sidebar__container">
          <div className="Sidebar__lista">
          <h6> No hay categorias</h6>
          </div>
        </div>
      )
    }else{
    return (
      <div className="Sidebar__container">
        <div className="Sidebar__lista">
          {props.categories[0].data.map((product, index) => {
            return (
              // <Button>
                <a
                  href="#"
                  onClick={(e) => {
                    categoria(e);
                  }}
                >
                  {product.taste}
                </a>
              // </Button>
            );
          })}
        </div>
      </div>
    );};
  } else{
    return (<h3>No hay productos</h3>);

  }

}

const mapStateToProps = (state) => {
  return {
    products: state.productReducers ? state.productReducers.allProducts : [],
    categories: state.productReducers ? state.productReducers.categories : [],
  };
};

export default connect(mapStateToProps, {
  getCategoryList,
  getProductsCategory,
})(Sidebar);
