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
	ok(MessageHub.un, 'MessageHub.un');
	ok(MessageHub.publish, 'MessageHub.publish');
	ok(MessageHub.emit, 'MessageHub.emit');
	ok(MessageHub.publishToAll, 'MessageHub.publishToAll');
	ok(MessageHub.spam, 'MessageHub.spam');
	ok(MessageHub.instance, 'MessageHub.instance');
	ok(MessageHub._, 'MessageHub._');

	// check props and defaults
	ok(MessageHub.subjects, 'MessageHub.subjects');
	ok(MessageHub.uid != undefined, 'MessageHub.uid');
	deepEqual(MessageHub.subjects, {}, 'MessageHub.subjects');
	equal(MessageHub.uid, 0, 'MessageHub.uid');
	
});

test('Subscription Structure', function() {

	// use new insstance for each test
	var Hub = window.MessageHub._(),
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
	var Hub = window.MessageHub._(),
		message,
		subscription = Hub.on('test', function(msg) {
			message = msg;
		});
		
	Hub.emit('test');
	
	ok(message, 'message defined');
	ok(message.getData, 'message.getData');
	ok(message.getSubject, 'message.getSubject');
	ok(message.getUid, 'message.getUid');
	ok(message.getTimestamp, 'message.getTimestamp');
	ok(message.timestamp, 'message.timestamp');
	equal(message.data, null,'message.data');
	equal(message.subject, 'test', 'message.subject');
	equal(message.uid, 0, 'message.uid');

});