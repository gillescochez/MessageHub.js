# MessageHub.js

MessageHub is a singleton class to subscribe and publish messages.
Each subscription return a subscription object which gives methods to control the subscription.
Listener are run in the subscription context and receive a Message object containing the subject, data, timestamp and the subscription unique id

## API

### MessageHub

#### subscribe / on (subject, listener[, once])
Subscribe a listener to a subject and returns a Subscription object
If once set to true the listener will only be fired once

#### once(subject, listener)
Subscribe a listener to a given subject to be fired only once

#### unsubscribe / un (subject[, uid])
Unsubscribe all listener for a given subject or a single listener if a valid uid is passed

#### publish / emit (subject, data)
Publish a message

#### publishToAll / spam (subject, data)
Publish a message to ALL listeners that are currently listening (subscription not paused)

#### MessageHub.instance / MessageHub._

Static method to allow the creation of new instances of the Hub.

### Subscription object

Subscription object are returns by an on/once/subscribe methods of the MessageHub.

methods: pause, resume, remove, before, after, execute, setListener, setSubject, getListener, getSubject

aliases: on, off, rm, pre, post, run

### Message object

getSubject, getData, getTimestamp, getUid

## Usage

```javascript

var subscription = MessageHub.on("demo", function(msgObj) {
	console.log(
		"Subject: " + msgObj.getSubject() +
		" fooStr: " + msgObj.getData().fooStr +
		" Time: " + new Date(msgObj.getTimestamp()) +
		" Subscription unique ID: " + msgObj.getUid()
	);
	console.log(msgObj);
});

MessageHub.emit("demo", {
	fooStr: 'foo'
});

```