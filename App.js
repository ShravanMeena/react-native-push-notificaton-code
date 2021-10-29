import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function App() {
  const [showData, setShowData] = useState([]);
  useEffect(() => {
    const getRandomUsers = async () => {
      axios.get('https://jsonplaceholder.typicode.com/users').then(res => {
        setShowData(res.data);
      });
    };
    getRandomUsers();
    createChannels();
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  const sendNoti = () => {
    firestore()
      .collection('userDeviceToken')
      .get()
      .then(querySnap => {
        const userDevicetoken = querySnap.docs.map(docSnap => {
          return docSnap.data().token;
        });
        console.log(userDevicetoken);
        fetch('http://3dd2-49-36-234-20.ngrok.io/send-noti', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokens: userDevicetoken,
          }),
        });
      });
  };

  const createToken = (item, index) => {
    messaging()
      .getToken()
      .then(token => {
        console.log(token);
        alert('your token:', token);
        firestore().collection('userDeviceToken').add({
          token: token,
        });
      });

    // PushNotification.cancelAllLocalNotifications();

    // PushNotification.localNotification({
    //   channelId: 'test-channel',
    //   title: 'You clicked on ' + item.name,
    //   message: item.username,
    //   bigText:
    //     item.name +
    //     ' is one of the largest and most beatiful cities in ' +
    //     item.username,
    //   color: 'red',
    //   id: index,
    // });

    // PushNotification.localNotificationSchedule({
    //   channelId: 'test-channel',
    //   title: 'Alarm',
    //   message: 'You clicked on ' + item.name + ' 20 seconds ago',
    //   date: new Date(Date.now() + 20 * 1000),
    //   allowWhileIdle: true,
    // });
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          backgroundColor: '#121212',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 40,
        }}>
        <TouchableOpacity
          onPress={() => createToken(item)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: 80,
            marginBottom: 20,
            backgroundColor: '#fff',
            borderRadius: 5,
          }}>
          <Text style={{color: '#121212'}}>Create your token for notify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => sendNoti(item)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: 80,
            marginBottom: 20,
            backgroundColor: '#fff',
            borderRadius: 5,
          }}>
          <Text style={{color: '#121212'}}>Send notification</Text>
        </TouchableOpacity>

        {/* {showData?.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => handleNotification(item)}
              key={index}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: 80,
                marginBottom: 20,
                backgroundColor: '#fff',
                borderRadius: 5,
              }}>
              <Text style={{color: '#121212'}}>{item.name}</Text>
            </TouchableOpacity>
          );
        })} */}
      </View>
    </ScrollView>
  );
}
