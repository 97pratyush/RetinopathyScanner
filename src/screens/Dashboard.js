import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'react-native';

export default function Dashboard({ navigation }) {
  const [loaded, setLoad] = useState(null);
  const [percentageResult, setResult] = useState(null);  
  const [jwt_token, setToken] = useState(null);
  const [probability, setProbability] = useState(null);
  const [image, setImage] = useState(null);
  const [articles, setArticles] = useState(null);

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
      let token = await AsyncStorage.getItem('jwt_token');
      form.append('image', result.file);
      form.append('token', token);
      fetch(
        'http://ec2-3-145-72-186.us-east-2.compute.amazonaws.com:5000/checkImage', {
          body: form,
          method: "POST"
        }
      ).then((response) => {
        return response.json()
      })
      .then((json)=>{
        console.log(json);
        setLoad(true);
        setProbability(json.probab);
        setImage(result.uri);
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
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      { loaded && <Header>{ percentageResult }. Confidence on outcome : { Math.round(probability*10000)/100 }%</Header> }      
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