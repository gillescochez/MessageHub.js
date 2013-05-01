(function() {

	'use strict';

	/**
	 * Hub class constructor
	 * @private
	 * @constructor
	 */
	var Hub = function() {};

	extend(Hub.prototype, {

		/**
		 * subjects storage
		 */
		subjects: {},

		/**
		 * Unique subscription id
		 */
		uid: 0,

		/**
		 * Add a listener for a given subject and return a subscription object
		 * @param subject
		 * @param listener
		 * @param once
		 * @returns {Subscription}
		 */
		on: function(subject, listener, once) {

			var subscription;

			if (!this.subjects[subject]) this.subjects[subject] = [];

			subscription = new Subscription(subject, listener, this, once);
			subscription._uid = this.uid++;

			this.subjects[subject].push(subscription);

			return subscription;
		},

		/**
		 * Identical to on/subscribe but only execute the callback once
		 * @param subject
		 * @param listener
		 * @returns {Subscription}
		 */
		once: function(subject, listener) {
			return this.on(subject, listener, true);
		},

		/**
		 * Remove a given subject from the hub
		 * @param subject
		 * @param uid
		 */
		off: function(subject, uid) {

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

		/**
		 * Publish to a given subject some data
		 * @param subject
		 * @param data
		 */
		emit: function(subject, data) {

			if (this.subjects[subject]) {
				this.subjects[subject].forEach(function(subscription) {
					subscription.execute(subject, data);
				});
			};
		},

		/**
		 * Force publish a message and some data to all listening subscription
		 * @param subject
		 * @param data
		 */
		spam: function(subject, data) {

			var ids = [];

			for (var sub in this.subjects) {

				this.subjects[sub].forEach(function(subscription) {

					//TODO create a test case for this
					if (!ids[subscription._uid]) {

						subscription.execute(subject, data, true);
						ids[subscription._uid] = true;
					};
				});
			};
		},

		/**
		 * Return a new instance of the Hub class
		 * @returns {Hub}
		 * @private
		 */
		_: function() {
			return new Hub();
		}
	});

	/**
	 * Aliases for the Hub object
	 */
	alias(Hub, 'on', 'subscribe');
	alias(Hub, 'off', 'unsubscribe');
	alias(Hub, 'emit', 'publish');
	alias(Hub, 'spam', 'publishToAll');
	alias(Hub, '_', 'instance');

	/**
	 * Subscription object constructor
	 * @param subject
	 * @param listener
	 * @param hub
	 * @param once
	 * @constructor
	 */
	var Subscription = function(subject, listener, hub, once) {
		this.subject = subject;
		this.listener = listener;
		this._once = once;
		this._hub = hub;
	};

	extend(Subscription.prototype, {

		/**
		 * Private properties
		 */
		_listening: true,
		_before: null,
		_after: null,
		_uid: null,

		/**
		 * Create a new message object and pass it to interested listeners
		 * @param subject
		 * @param data
		 * @param force
		 */
		execute: function(subject, data, force) {

			if (force || this.subject === subject) {

				if (this.listener && this._listening) {

					var args = [new Message(subject, data, this._uid)];

					if (this._once) this._hub.off(subject, this.uid);

					if (this._before) this._before.apply(this, args);

					// we check again here as the before function could affect the properties
					if (this.listener && this._listening) {
						this.listener.apply(this, args);
					};

					if (this._after) this._after.apply(this, args);
				};
			};
		},

		/**
		 * Set a function to run before the listener is called
		 * @param fn
		 * @returns {*}
		 */
		before: function(fn) {
			this._before = fn;
			return this;
		},

		/**
		 * Set a function to run before the listener is called
		 * @param fn
		 * @returns {*}
		 */
		after: function(fn) {
			this._after = fn;
			return this;
		},

		/**
		 * Remove the listener set on the subscription object
		 * @returns {*}
		 */
		remove: function() {
			return this.setListener(null);
		},

		/**
		 * Toggle between pause and resume mode
		 */
		toggle: function() {
			this._listening = !this._listening;
		},

		/**
		 * Stop listening
		 * @returns {*}
		 */
		pause: function() {
			this._listening = false;
			return this;
		},

		/**
		 * Start listening again
		 * @returns {*}
		 */
		resume: function() {
			this._listening = true;
			return this;
		},

		/**
		 * Setter which can ONLY be used to set the subject and listener
		 * @param key
		 * @param value
		 * @returns {*}
		 */
		set: function(key, value) {
		
			if (key !== 'subject' && key !== 'listener') {
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

	/**
	 * Set some aliases for the Subscription object
	 */
	alias(Subscription, 'remove', 'rm');
	alias(Subscription, 'execute', 'run');
	alias(Subscription, 'resume', 'on');
	alias(Subscription, 'pause', 'off');
	alias(Subscription, 'before', 'pre');
	alias(Subscription, 'after', 'post');

	/**
	 * Set the subject for the current subscription
	 * @param value
	 * @returns {*}
	 */
	Subscription.prototype.setSubject = function(value) {
		this.set('subject', value);
		return this;
	};

	/**
	 * Return the subject set for the subscription object
	 * @returns {string}
	 */
	Subscription.prototype.getSubject = function() {
		return this.subject;
	};

	/**
	 * Set the listener for the subscription object
	 * @param value
	 * @returns {*}
	 */
	Subscription.prototype.setListener = function(value) {
		this.set('listener', value);
		return this;
	};

	/**
	 * Get the listener set on the subscription object
	 * @returns {function}
	 */
	Subscription.prototype.getListener = function() {
		return this.listener;
	};

	/**
	 * Message object
	 * @param subject
	 * @param data
	 * @param uid
	 * @constructor
	 */
	var Message = function(subject, data, uid) {

		/**
		 * Private data object
		 * @type {{data: (*|null), subject: (*|null), timestamp: number, uid: *}}
		 */
		var privateData = {
			data: data || null,
			subject: subject || null,
			timestamp: new Date().getTime(),
			uid: uid
		};

		/**
		 * Getter to allow read of the data
		 * @param key
		 * @returns {*}
		 */
		this.get = function(key) {
			return privateData[key];
		};
	};

	/**
	 * Public getter for the message
	 */
	['data', 'subject', 'timestamp', 'uid'].forEach(function(key) {
		(function(method, key) {
			Message.prototype['get' + method] = function() {
				return privateData[key];
			};
		})(firstUp(key), key);
	});

	/**
	 * Simple extend helper
	 * @param sub
	 * @param sup
	 */
	function extend(sub, sup) {
		for (var prop in sup) sub[prop] = sup[prop];
	};

	/**
	 * Simple alias creator helper
	 * @param object
	 * @param origin
	 * @param alias
	 */
	function alias(object, origin, alias) {
		object.prototype[alias] = object.prototype[origin];
	};

	/**
	 * Uppercase the first character of a string
	 * @param str
	 * @returns {string}
	 */
	function firstUp(str) {
		var len = str.length;
		return str.substring(0, 1).toUpperCase() + str.substring(1, len);
	};

	/**
	 * Create the public MessageHub singleton
	 * @type {Hub}
	 */
	window.MessageHub = new Hub();

})();