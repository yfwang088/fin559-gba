import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Container, CssBaseline, Button,Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  "region": process.env.REACT_APP_REGION,
  "credentials": {
    "accessKeyId": process.env.REACT_APP_ACCESSKEY, 
    "secretAccessKey": process.env.REACT_APP_SECRETACCESSKEY,
  },
  });
const docClient = DynamoDBDocumentClient.from(client);

const testman = {id:"12345", name:"Bay Stonefield", age:"35", pos:"Developer"};

const getEmployeeByID = (id) => new Promise(async (resolve, reject) => {
  try {
      const command = new GetCommand({
        TableName: "EmployeeData",
        Key: {
          "ID": id,
        },
      });
      const response = await docClient.send(command);
      resolve(response);
  } catch (ex) {
      console.log(ex);
      reject(ex.message);
  }
});

const putEmployee = (id, name, age, position) => new Promise(async (resolve, reject) => {
  try {
      const command = new PutCommand({
        TableName: "EmployeeData",
        Item: {
          "ID": id,
          "Name": name,
          "Age": age,
          "Position": position,
        },
      });
      const response = await docClient.send(command);
      resolve(response);
  } catch (ex) {
      console.log(ex);
      reject(ex.message);
  }
});



const App = () => {
  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  const [b1Running, setB1Running] = useState(false);
  const [b2Running, setB2Running] = useState(false);

  const b1Click = async () => {
    setB1Running(true);
    await getEmployeeByID(testman.id).then((data) =>{
      console.log(data.Item);
    }).catch((ex)=>{
      console.log(ex);
    });
    setB1Running(false);
  };
  
  const b2Click = async () => {
    setB2Running(true);
    await putEmployee(testman.id, testman.name,testman.age,testman.pos).catch((ex)=>{
      console.log(ex);
    });
    setB2Running(false);
  };


  return (
    <>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
                gap: 2,
            }}
        >
        <Typography id='title' variant='h3'>
            Employee Management System
        </Typography>
        <nav>
        <Button
          variant='outlined'
          size='large'
          startIcon={<AddIcon />}
          onClick={b1Click}
          disabled={b1Running||b2Running}
        >
        Search
        </Button>
        <Button
          variant='outlined'
          size='large'
          startIcon={<SearchIcon />}
          onClick={b2Click}
          disabled={b1Running||b2Running}
        >
        Add
        </Button>
      </nav>
        </Container>
        </ThemeProvider>
        </>
  );
};

export default App;