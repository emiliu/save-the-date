/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const eventConfig = {
  title: 'New Event',
  startDate: '2018-01-20T08:00:00.000Z',  // 3am est
  endDate: '2018-01-20T14:00:00.000Z'     // 9am est
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native! Hello there
        </Text>
        <Button
          onPress={() => {

            AddCalendarEvent.presentNewCalendarEventDialog(eventConfig)
              .then(eventId => {
                if (eventId) {
                  console.warn(eventId);
                } else {
                  console.warn('dismissed');
                }
              })
              .catch((error: string) => {
                console.warn(error);
              });

            console.log('hello');

            fetch('https://facebook.github.io/react-native/movies.json')
              .then((response) => console.log(response));

          }}
          title="Press Me"
        />
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
