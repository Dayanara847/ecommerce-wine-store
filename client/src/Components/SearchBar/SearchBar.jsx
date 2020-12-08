import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function SearchBar() {
  const [inputSearch, setinputSearch] = useState("");

  return (
    <div>
      <form onSubmit={(e) => {e.preventDefault();}} className="SearchBar__form" noValidate autoComplete="off">
        <TextField id="standard-basic" label="Standard" onChange={(e) => { setinputSearch(e.target.value)}}/>
        <Button type="submit">Buscar</Button>
      </form>
    </div>
  );
}

export default SearchBar;

// El componente Search Bar es un formulario conectado de un sólo input, al submitear ejecuta una función recibida por props con el texto ingresado.

// Notas: la función que recibe la vamos a utilizar en el futuro para disparar una acción de redux.
