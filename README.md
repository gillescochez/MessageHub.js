# MessageHub.js

MessageHub is a singleton class to subscribe and publish messages.
Each subscription return a subscription object which gives methods to control the subscription.

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

#### MessageHub.instance()

Static method to allow the creation of new instances of the Hub.

### Subscription object

Subscription object are returns by an on/once/subscribe methods of the MessageHub.

pause, resume, remove, before, after, setListener, setSubject, getListener, getSubject

### Message object

Currently not used but maybe soon as optional or default instead of the current subject, data combo returned to the listeners

getSubject, getData, getTimestamp, getUid

## Usage

```javascript

var subscription = MessageHub.subscribe('test', function(subject, data) {
		console.log(subject);
	}),
	dummyData = {
		foo:'foo'
	};

// triggered
MessageHub.publish('test', dummyData);

// we pause the subscription
subscription.pause();

// not triggered
MessageHub.publish('test', dummyData);

// resume subscription
subscription.resume();

//triggered
MessageHub.publish('test', dummyData);

// replace the listener
subscription.setListener(function() {
	console.log('overwriten!');
});

MessageHub.publish('test', dummyData);

// remove the listener
subscription.remove();

// nothing happens
MessageHub.publish('test', dummyData);

// set a new one
subscription.setListener(function(subject, data) {
	console.log(subject, data);
});

// but also set a new subject
subscription.set('subject', 'new');

// on old one nothing happen still
MessageHub.emit('test', dummyData);

// triggers on new one
MessageHub.emit('new', dummyData);

// one time listening
MessageHub.once('once', function() {
	console.log('once');
});

// should run only once
MessageHub.emit('once');
MessageHub.emit('once');

// force all set listeners to be run with given subject and data
MessageHub.spam('spam', {spam:true});

// let's use before and after to filter the spam above :)
subscription.before(function(subject) {
	if (subject === 'spam') this.pause();
})
.after(function(subject) {
	if (subject === 'spam') this.resume();
});

// spam wont trigger but new will
MessageHub.spam('spam', {spam:true});
MessageHub.emit('new', dummyData);

console.log(MessageHub.instance());

MessageHub.useMsgObj = true;

MessageHub.once('once', function(msgObj) {
	console.log(msgObj);
});

MessageHub.emit('once', {once:true});

```