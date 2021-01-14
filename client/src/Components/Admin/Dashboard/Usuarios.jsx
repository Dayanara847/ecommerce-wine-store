import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './Dashboard.modules.css';
import {
  allUsers,
  userPromote,
  sendEmail,
  resetUsers,
} from '../../../slices/userSlice';
import { usersListSelector, userStatusSelector } from '../../../selectors';
import EditIcon from '@material-ui/icons/Edit';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { CircularProgress, Button } from '@material-ui/core';

// Esta tabla es para el admin.
// Tiene que mostrar todos los usuarios.

function Usuarios() {
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector(usersListSelector);
  const status = useSelector(userStatusSelector);
  console.log('USUARIOS');
  let content;

  const handleRetry = () => {
    //func para reintentar y forzar refresh
    window.location.reload();
    return false;
  };

  const promoteUser = (id) => {
    let user = users.filter((u) => u.id === id);
    dispatch(userPromote(id));
    console.log('USER', user[0].firstName);
    dispatch(
      sendEmail({
        name: user[0].firstName,
        email: user[0].email,
        type: 'Promote',
      })
    );
    // dispatch(resetUsers());
    //falta que vuelva a renderizar
  };

  useEffect(() => {
    if (status === 'idle') dispatch(allUsers());
  }, [dispatch, users]);

  if (status === 'loading') {
    content = (
      <>
        <h2>Cargando...</h2>
        <CircularProgress />
      </>
    );
  } else if (status === 'succeded') {
    content = users.map((user) => {
      let even = user.id % 2 === 0 ? 'white' : 'beige';
      return (
        <>
          <div className="grid-item" style={{ backgroundColor: even }}>
            {user.id}
          </div>
          <div className="grid-item" style={{ backgroundColor: even }}>
            {user.firstName + ' ' + user.lastName}
          </div>
          {!user.isAdmin ? (
            <Button
              className="editButton"
              style={{ backgroundColor: even }}
              onClick={() => promoteUser(user.id)}
            >
              <ArrowUpwardIcon className="grid-item"></ArrowUpwardIcon>
            </Button>
          ) : (
            <Button
              className="editButton"
              style={{ backgroundColor: even }}
              disabled="true"
            >
              <ArrowUpwardIcon className="grid-item"></ArrowUpwardIcon>
            </Button>
          )}
        </>
      );
    });
  } else if (status === 'failed') {
    content = (
      <>
        <h3>Ha ocurrido un error</h3>
        <Button onClick={handleRetry}>Reintentar</Button>
      </>
    );
  }
  return (
    <div class="grid-container">
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Id
      </p>
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Usuario
      </p>
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Promover
      </p>
      {content}
    </div>
  );
}

export default Usuarios;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { CircularProgress, Container, Button } from "@material-ui/core";
// import { Formik, Form } from "formik";
// import FormField from "../../FormComponents/FormField";
// import { formatArrayToOption } from "../../utils/index";
// import { userStatusSelector, usersListSelector } from "../../../selectors/index";
// import { userPromote, sendEmail } from "../../../slices/userSlice";
// import './Dashboard.modules.css';

// export default function PromoteUser() {
//   const dispatch = useDispatch();
//   const userStatus = useSelector(userStatusSelector);
//   const users = useSelector(usersListSelector);
//   const [usersOption, setUsersOption] = useState([]);

//   const handleSubmit = (values) => {
//     let userId = values.usersToPromote;
//     let userToPromote = users.filter(u => u.id === userId)
//     dispatch(userPromote(userId));
//     dispatch(sendEmail({ name: userToPromote[0].firstName, email: userToPromote[0].email, type: 'Promote' }));
//   };

//   const initialValues = {
//     usersToPromote: "",
//   };

//   let content;

//   useEffect(() => {
//     if (userStatus === "succeded") {
//       setUsersOption(formatArrayToOption(users, 'firstName'));
//     }
//   }, []);

//   if (userStatus === "loading") {
//     //* si loading renderizamos `Cargando...`
//     content = (
//       <>
//         <h2>Cargando....</h2>
//         <CircularProgress />
//       </>
//     );
//   } else if (userStatus === "succeded") {
//     content = (
//       <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//         {(formik) => (
//           <Container>
//             <Form id="form" >
//               <FormField
//                 fieldType="select"
//                 label="Listado de usuarios"
//                 name="usersToPromote"
//                 options={usersOption}
//                 required
//               />

//               <br></br>
//               <Container>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   disabled={!formik.isValid}
//                   type="submit"
//                 >
//                   Promover
//                   </Button>
//                 </Container>
//                 </Form>
//               </Container>
//           )
//         }
//       </Formik>
//     )
//   };
// }
