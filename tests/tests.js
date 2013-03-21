test('Structure', function() {

	expect(17);
	
	// check scope
	ok(!window.Hub, 'Hub private');
    ok(!window.Subscription, 'Subscription private');
	ok(MessageHub, 'MessageHub public');
	
	// check API
	ok(MessageHub.on, 'MessageHub.on');
	ok(MessageHub.subscribe, 'MessageHub.subscribe');
	ok(MessageHub.unsubscribe, 'MessageHub.unsubscribe');
	ok(MessageHub.un, 'MessageHub.un');
	ok(MessageHub.publish, 'MessageHub.publish');
	ok(MessageHub.emit, 'MessageHub.emit');
	ok(MessageHub.publishToAll, 'MessageHub.publishToAll');
	ok(MessageHub.spam, 'MessageHub.spam');
	ok(MessageHub.instance, 'MessageHub.instance');
	ok(MessageHub._, 'MessageHub._');
	
	// check props
	ok(MessageHub.subjects, 'MessageHub.spam');
	ok(MessageHub.uid != undefined, 'MessageHub.uid');
	
	// check defauls
	deepEqual(MessageHub.subjects, {}, 'MessageHub.spam');
	equal(MessageHub.uid, 0, 'MessageHub.uid');
	
});