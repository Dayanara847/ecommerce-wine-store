import React from "react";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

function ReviewCard(props) {
  return (
    <>
    <Box component="fieldset" mt={3} borderColor="transparent">
      <Rating value={props.data.points} readOnly />
    </Box>
    <h4>
      {props.data.description} {/*  QUEDA TAPADO POR EL TAMAÑO DEL DIV */}
    </h4>
    </>
  );
}

export default ReviewCard;