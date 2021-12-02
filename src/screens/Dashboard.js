import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

export default function Dashboard({ navigation }) {
  const [loaded, setLoad] = useState(null);
  const [percentageResult, setResult] = useState(null);  
  const [jwt_token, setToken] = useState(null);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('jwt_token')
      if(value !== null) {
        setToken(value)
      }
     } catch(e) {
      console.log('AsyncStorage Error' + e.message);
    }
  }

  const UploadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    var form = new FormData();
      // console.log(result);
      let token = await AsyncStorage.getItem('jwt_token');
      form.append('image', result.file);
      // form.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFiY2QifQ.0064Yy1voJSJJpge3zmDNEQT5LakV7C1uTL1Qw5nYMs');
      form.append('token', token);
      fetch(
        'http://ec2-3-145-72-186.us-east-2.compute.amazonaws.com:5000/checkImage',
        {
          body: form,
          method: "POST"
        }
      ).then((response) => 
      {
        return response.json()
      })
      .then((json)=>{
        console.log(json);
        //getData()
        setLoad(true)
        setResult(json.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Background>
      <Logo />
      <Header>Upload eye scan below</Header>
      {!loaded && <Button onPress={UploadFile}> Upload </Button>}
      { loaded && <Paragraph> Result : { percentageResult } </Paragraph> }      
      <Button
        mode="outlined"
        onPress={() =>{
          AsyncStorage.removeItem('jwt_token')
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
        }
      >
        Logout
      </Button>
    </Background>
  )
}