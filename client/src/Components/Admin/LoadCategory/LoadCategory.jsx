import React, { Component } from 'react';
import FormField from '../../FormComponents/FormField';
import { Formik, Form } from 'formik';
import { validationSchemaLoadCategories } from '../adminValidations.js';
import { Container, Paper, Button } from '@material-ui/core';
import '../LoadPorduct/LoadProduct.modules.css';
import axios from 'axios';

export const LoadProduct = (props) => {
  const initialValues = {
    name: '',
    description: '',
    pairing: '',
    origin: '',
  };

  const postNewCategory = async (category) => {
    try {
      const resp = await axios.post(
        'http://localhost:3000/products/category',
        category
      );
      console.log('POST', resp);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = (values, onSubmitProps) => {
    // console.log('VALUES', values);
    postNewCategory(values);
    // onSubmitProps.resetForm();
  };

  return (
    <Container className="">
      <h1>Carga de categorías</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemaLoadCategories}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="input"
                label="Nombre de categoría"
                name="name"
                required
              />
              <FormField
                fieldType="textarea"
                label="Descripción de la categoría"
                name="description"
                rows={8}
                required
              />
              <br></br>
              <Container>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!formik.isValid}
                  type="submit"
                >
                  {' '}
                  Cargar
                </Button>
              </Container>
            </Form>
          </Container>
        )}
      </Formik>
    </Container>
  );
};

export default LoadProduct;
