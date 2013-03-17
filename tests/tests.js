test('Structure', function() {

	expect(15);
	
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
	
	// check props
	ok(MessageHub.subjects, 'MessageHub.spam');
	ok(MessageHub._uid != undefined, 'MessageHub._uid');
	
	// check defauls
	deepEqual(MessageHub.subjects, {}, 'MessageHub.spam');
	equal(MessageHub._uid, 0, 'MessageHub._uid');
	
});