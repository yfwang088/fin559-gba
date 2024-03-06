import React, { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
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


const InputField = ({id, label, value, setfucn}) => {

  const handleInputChange = (event) => {
    setfucn(event.target.value);
  };

  return (
      <TextField
          required
          id={id}
          label={label}
          value={value}
          onChange={handleInputChange}
          variant="filled"
        />
  );
};

const TextPanel = ({ text }) => {
  return (
    <Paper style={{ width: '400px', height: '200px', padding: '16px', overflow: "auto",}}>
      <Typography variant="body1">{text}</Typography>
    </Paper>
  );
};


const App = () => {
  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  const [b1Running, setB1Running] = useState(false);
  const [b2Running, setB2Running] = useState(false);
  const [IDText, setIDText] = useState("");
  const [nameText, setNameText] = useState("");
  const [ageText, setAgeText] = useState("");
  const [posText, setPosText] = useState("");
  const [searchText, setSearchText] = useState('');
  const [resultText, setResultText] = useState('The result will show here.');


  const b1Click = async () => {
    setB1Running(true);
    await putEmployee(IDText, nameText,ageText,posText).then(setResultText('Success! A new employee has been recorded.')).catch((ex)=>{
      setResultText(ex.message);
    });
    setB1Running(false);
  };
  
  const b2Click = async () => {
    setB2Running(true);
    await getEmployeeByID(searchText).then((data) =>{
      if(data.Item){
        setResultText(`ID:${data.Item.ID}, Name:${data.Item.Name}, Age:${data.Item.Age}, Position:${data.Item.Position}.`);
      }else{
        setResultText("ID does not match existing record.");
      }
    }).catch((ex)=>{
      console.log(ex);
    });
    setB2Running(false);
  };

  const isEmpty = (value) =>{
    return value === "";
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
          <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
              <div>
        <InputField
          id="add-id"
          label="ID"
          value={IDText}
          setfucn={setIDText}
        />
        <InputField
          id="add-name"
          label="Name"
          value={nameText}
          setfucn={setNameText}
        />
        <InputField
          id="add-age"
          label="Age"
          value={ageText}
          setfucn={setAgeText}
        />
        <InputField
          id="add-pos"
          label="Position"
          value={posText}
          setfucn={setPosText}
        />
        <Button
          variant='outlined'
          size='large'
          startIcon={<AddIcon/>}
          onClick={b1Click}
          disabled={b1Running||b2Running||isEmpty(IDText)||isEmpty(nameText)||isEmpty(ageText)||isEmpty(posText)}
        >
        Add
        </Button>
      </div>
      </Box>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
        <InputField
          id="serach-id"
          label="Search by ID"
          value={searchText}
          setfucn={setSearchText}
        />
        <Button
          variant='outlined'
          size='large'
          startIcon={<SearchIcon />}
          onClick={b2Click}
          disabled={b1Running||b2Running||isEmpty(searchText)}
        >
        Search
        </Button>
        </div>
      </Box>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '30ch' },
        }}
        noValidate
        autoComplete="off"
      >
      <div>
      <TextPanel text={resultText} />
      </div>
      </Box>
        </Container>
        </ThemeProvider>
        </>
  );
};

export default App;