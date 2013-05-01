test('MessageHub Structure', function() {

	// check scope
	ok(!window.Hub, 'Hub object private');
    ok(!window.Subscription, 'Subscription object private');
    ok(!window.Message, 'Message object private');
	ok(MessageHub, 'MessageHub singletone public');
	
	// check API
	ok(MessageHub.on, 'MessageHub.on');
	ok(MessageHub.once, 'MessageHub.once');
	ok(MessageHub.subscribe, 'MessageHub.subscribe');
	ok(MessageHub.unsubscribe, 'MessageHub.unsubscribe');
	ok(MessageHub.off, 'MessageHub.off');
	ok(MessageHub.publish, 'MessageHub.publish');
	ok(MessageHub.emit, 'MessageHub.emit');
	ok(MessageHub.publishToAll, 'MessageHub.publishToAll');
	ok(MessageHub.spam, 'MessageHub.spam');
	ok(MessageHub.instance, 'MessageHub.instance');
	ok(MessageHub._, 'MessageHub._');

	// check props and defaults
	ok(MessageHub.subjects, 'MessageHub.subjects');
	ok(MessageHub.uid != undefined, 'MessageHub.uid');
	equal(MessageHub.uid, 0, 'MessageHub.uid');
	
});

test('Subscription Structure', function() {

	// use new instance for each test
	var Hub = MessageHub._(),
		listener = function(){},
		subscription = Hub.on('test', listener);
	
	ok(subscription, "subscription exists");
	
	// test API
	ok(subscription.execute, "subscription.execute");
	ok(subscription.before, "subscription.before");
	ok(subscription.pre, "subscription.pre");
	ok(subscription.after, "subscription.after");
	ok(subscription.post, "subscription.post");
	ok(subscription.pause, "subscription.pause");
	ok(subscription.off, "subscription.off");
	ok(subscription.resume, "subscription.resume");
	ok(subscription.on, "subscription.on");
	ok(subscription.toggle, "subscription.toggle");
	ok(subscription.remove, "subscription.remove");
	ok(subscription.rm, "subscription.rm");
	ok(subscription.set, "subscription.set");
	
	// test props and defaults
	equal(subscription.subject, 'test', "subscription._uid");
	deepEqual(subscription.listener, listener, "subscription.listener");
	equal(subscription._once, undefined, "subscription._once");
	equal(subscription._uid, 0, "subscription._uid");
	equal(subscription._before, null, "subscription._before");
	equal(subscription._after, null, "subscription._after");
	equal(subscription._listening, true, "subscription._listening");

});

test('Message structure', function() {

	// use new insstance for each test
	var Hub = MessageHub._();

	Hub.on('test', function(message) {
		ok(message, 'message defined');
		ok(message.getData, 'message.getData');
		ok(message.getSubject, 'message.getSubject');
		ok(message.getUid, 'message.getUid');
		ok(message.getTimestamp, 'message.getTimestamp');

		equal(message.timestamp, undefined, 'timestamp is read only');
		equal(message.data, undefined,'data is read only');
		equal(message.subject, undefined, 'subject is read only');
		equal(message.uid, undefined, 'uid is read only');

		equal(message.getData(), null,'message.data');
		equal(message.getSubject(), 'test', 'message.subject');
		equal(message.getUid(), 0, 'message.uid');
	});
		
	Hub.emit('test');

});

test('Aliases', function() {

	// use new insstance for each test
	var hub = MessageHub._(),
		subscription = hub.on('test', function() {});

	deepEqual(hub.on, hub.subscribe, 'on => subscribe');
	deepEqual(hub.off, hub.unsubscribe, 'off => unsubscribe');
	deepEqual(hub.emit, hub.publish, 'emit => publish');
	deepEqual(hub.spam, hub.publishToAll, 'spam => publishToAll');
	deepEqual(hub._, hub.instance, '_ => instance');

	deepEqual(subscription.remove, subscription.rm, 'remove => rm');
	deepEqual(subscription.execute, subscription.run, 'execute => run');
	deepEqual(subscription.resume, subscription.on, 'resume => on');
	deepEqual(subscription.pause, subscription.off, 'pause => off');
	deepEqual(subscription.before, subscription.pre, 'before => pre');
	deepEqual(subscription.after, subscription.post, 'after => post');

});