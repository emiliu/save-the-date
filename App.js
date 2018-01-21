/**
 * Sched-U
 * https://github.com/emiliu/save-the-date
 */

import React, { Component } from 'react';
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PhotoUpload from 'react-native-photo-upload';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

let chrono = require('chrono-node');
let moment = require('moment-timezone');

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>
          Sched-U
        </Text>
        <PhotoUpload
          onPhotoSelect={img => {
            if (img) {
              request_vision(img);
            }
          }}
        >
          <Image
            style={styles.image_picker}
            resizeMode='cover'
            source={require('./img/poster.jpg')}
          />
        </PhotoUpload>
        <Text style={styles.instructions}>
          To get started, tap the photo above to upload or take a photo of your desired poster.
        </Text>
      </View>
    );
  }
}

let request_vision = (base64img) => {

  console.log('hello');

  fetch('https://vision.googleapis.com/v1/images:annotate?key=', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "requests": [
        {
          "features": [
            {
              "type": "LABEL_DETECTION"
            },
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ],
          "image": {
            "content": base64img,
          }
        }
      ]
    })
  }).then((response) => {
    response.json().then((res) => {
      console.log(res.responses[0]);
      let msg = res.responses[0].fullTextAnnotation.text;
      console.log(msg);
      add_event(msg);
      console.log('add');
    });
  });

}

let process_text = (message) => message.toLowerCase().replace('time:','').replace('date:','').split('\n').join(' ').replace('  ',' ');

let parse_date = (message) => {
  let dates = chrono.parse(message);
  console.log(dates);
  let res = Math.max.apply(Math, dates.map(e => e.text.length));
  let date = dates.find(e => e.text.length === res);
  date_est = moment.tz(chrono.parseDate(date.text), 'America/New_York');
  date_utc = moment.tz(date_est, 'Europe/Dublin');
  date_str = date_utc.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  console.log(date_str);
  return date_str;
}

let add_event = (message) => {
  let date = parse_date(process_text(message));
  console.log(date);

  const eventConfig = {
    title: 'New Event',
    startDate: date
  }

  AddCalendarEvent.presentNewCalendarEventDialog(eventConfig)
    .then(eventId => {
      if (eventId) {
        console.warn(eventId);
      } else {
        console.warn('Event not created');
      }
    })
    .catch((error: string) => {
      console.log(error);
      console.warn('No matching dates');
    });
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  h1: {
    fontSize: 30,
    textAlign: 'center',
    color: '#4682b4',
    marginTop: 20,
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    color: '#367588',
    marginBottom: 50,
  },
  image_picker: {
    paddingVertical: 20,
    width: 300,
    height: 450
  }
});
