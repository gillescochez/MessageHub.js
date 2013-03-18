var subscription = MessageHub.subscribe('test', function(subject, data) {
		console.log(subject, data);
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





