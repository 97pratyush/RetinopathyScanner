import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import Paragraph from '../components/Paragraph'

export default function Dashboard({ navigation }) {
  const [image, setImage] = useState(null);
  const [percentageResult, setResult] = useState(null);  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      var form = new FormData();
      form.append('dashboard',result);
      fetch(
        'https://webhook.site/5cd1487f-0ce3-4aa6-8d06-0f254efde0e8',
        {
          body: form,
          method: "PUT",
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((response) => response.json())
      .catch((error) => {
        console.error(error);
      })
      .then((responseData) => {
        console.log("Success "+ responseData)
      }).catch((error) => console.error(error));

      try {
          const apiCall = fetch('https://api/result');
          const finalResult = apiCall.json();
          setResult(finalResult);
      } catch(err) {
          console.log("Error fetching data-----------", err);
      };

    };
}

  return (
    <Background>
      <Logo />
      <Header>Upload eye scan below</Header>
      <Button onPress={pickImage}> Upload </Button>
      { image && 
      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> &&
      <Header> Result : { percentageResult }</Header> 
      }      
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
}