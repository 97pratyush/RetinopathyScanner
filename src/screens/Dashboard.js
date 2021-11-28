import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function Dashboard({ navigation }) {
  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       if (status !== 'granted') {
  //         alert('Storage permission is needed to upload image!');
  //       }
  //     }
  //   })();
  // }, []);
  
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
    };
}

  return (
    <Background>
      <Logo />
      <Header>Upload eye scan below</Header>
      <Button onPress={pickImage}> Upload </Button>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}      
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