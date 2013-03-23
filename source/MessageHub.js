(function() {

	'use strict';

	/*
		Private Hub object
	*/
	var Hub = function() {};

	extend(Hub.prototype, {

		subjects: {},
		uid: 0,

		on: function(subject, listener, once) {

			var subscription;

			if (!this.subjects[subject]) this.subjects[subject] = [];

			subscription = new Subscription(subject, listener, this, once);
			subscription._uid = this.uid++;

			this.subjects[subject].push(subscription);

			return subscription;
		},

		once: function(subject, listener) {
			return this.on(subject, listener, true);
		},

		un: function(subject, uid) {

			if (this.subjects[subject]) {

				if (!uid) {
					this.subjects[subject] = null;
					delete this.subjects[subject];
					return;
				};

				this.subjects[subject].forEach(function(item, i) {
					if (item._uid === uid) items.splice(i, 1);
				}, this);

				if (this.subjects[subject].length < 1) {
					this.subjects[subject] = null;
					delete this.subjects[subject];
				};
			};
		},

		emit: function(subject, data) {

			if (this.subjects[subject]) {
				this.subjects[subject].forEach(function(subscription) {
					subscription.run(subject, data);
				});
			};
		},

		spam: function(subject, data) {

			var ids = [];

			for (var sub in this.subjects) {

				this.subjects[sub].forEach(function(subscription) {

					if (!ids[subscription._uid]) {
					
						subscription.run(subject, data, true);
						ids[subscription._uid] = true;
					};
				});
			};
		},

		_: function() {
			return new Hub();
		}
	});

	alias(Hub, 'on', 'subscribe');
	alias(Hub, 'un', 'unsubscribe');
	alias(Hub, 'emit', 'publish');
	alias(Hub, 'spam', 'publishToAll');
	alias(Hub, '_', 'instance');

	/*
		Private Subscription object
	*/
	var Subscription = function(subject, listener, hub, once) {
		this.subject = subject;
		this.listener = listener;
		this._once = once;
		this._hub = hub;
	};

	extend(Subscription.prototype, {

		_listening: true,
		_before: null,
		_after: null,
		_uid: null,

		execute: function(subject, data, force) {

			if (force || this.subject === subject) {

				if (this.listener && this._listening) {

					var args = [new Message(subject, data, this._uid)];

					if (this._once) this._hub.un(subject, this.uid);

					if (this._before) this._before.apply(this, args);

					// we check again here as the before function could affect the properties
					if (this.listener && this._listening) {
						this.listener.apply(this, args);
					};

					if (this._after) this._after.apply(this, args);
				};
			};
		},

		before: function(fn) {
			this._before = fn;
			return this;
		},

		after: function(fn) {
			this._after = fn;
			return this;
		},

		remove: function() {
			return this.setListener(null);
		},

		toggle: function() {
			this._listening = !this._listening;
		},

		pause: function() {
			this._listening = false;
			return this;
		},
		
		resume: function() {
			this._listening = true;
			return this;
		},
		
		set: function(key, value) {
		
			if (key !== 'subject' && key !== 'listener' && key !== 'useMsgObj') {
				throw 'Subscription illegal setter key: ' + key;
			};
			
			this[key] = value;
			
			if (key === 'subject') {
				if (!this._hub.subjects[value]) this._hub.subjects[value] = [];
				this._hub.subjects[value].push(this);
			};
			
			return this;
		}
	});
	
	alias(Subscription, 'remove', 'rm');
	alias(Subscription, 'execute', 'run');
	alias(Subscription, 'resume', 'on');
	alias(Subscription, 'pause', 'off');
	alias(Subscription, 'before', 'pre');
	alias(Subscription, 'after', 'post');
	
	// generate setter/getter for public properties only
	['subject', 'listener'].forEach(function(key) {
	
		(function(method, key) {

			Subscription.prototype['set' + method] = function(value) {
				this.set(key, value);
				return this;
			};

			Subscription.prototype['get' + method] = function(value) {
				return this[key];
			};

		})(firstUp(key), key);
	});
	
	/*
		Private Message object
	*/
	var Message = function(subject, data, uid) {
		this.data = data || null;
		this.subject = subject || null;
		this.timestamp = new Date().getTime();
		this.uid = uid;
	};
	
	// public getter methods
	['data', 'subject', 'timestamp', 'uid'].forEach(function(key) {
		(function(method, key) {
			Message.prototype['get' + method] = function() {
				return this[key];
			};
		})(firstUp(key), key);
	});
	
	/*
		Private helpers
	*/
	function extend(sub, sup) {
		for (var prop in sup) sub[prop] = sup[prop];
	};
	
	function alias(object, origin, alias) {
		object.prototype[alias] = object.prototype[origin];
	};
	
	// e.g subject => Subject
	function firstUp(str) {
		var len = str.length;
		return str.substring(0, 1).toUpperCase() + str.substring(1, len);
	};

	// Singleton and exposure
	window.MessageHub = new Hub();

})();