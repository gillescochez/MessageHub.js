'use strict';

(function(MessageHub) {

	// Hub class
	var Hub = function() {
	
		this.subjects = {};
		this.uid = 0;
		this.useMsgObj = false;
	};
	
	Hub.prototype.subscribe = 
	Hub.prototype.on = function(subject, listener, once) {
	
		var subscription;
		
		if (!this.subjects[subject]) this.subjects[subject] = [];
		subscription = new Subscription(subject, listener, this, once);
		subscription._uid = this.uid++;
		if (this.useMsgObj) subscription.useMsgObj = true;
		this.subjects[subject].push(subscription);
		
		return subscription;
	};
	
	Hub.prototype.once = function(subject, listener) {
		return this.on(subject, listener, true);
	};

	Hub.prototype.unsubscribe = 
	Hub.prototype.un = function(subject, uid) {
	
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
	};

	Hub.prototype.publish = 
	Hub.prototype.emit = function(subject, data) {
	
		if (this.subjects[subject]) {
			this.subjects[subject].forEach(function(subscription) {
				subscription.execute(subject, data);
			});
		};
	};

	Hub.prototype.publishToAll = 
	Hub.prototype.spam = function(subject, data) {
	
		var ids = [];
		
		for (var sub in this.subjects) {
		
			this.subjects[sub].forEach(function(subscription) {
			
				if (!ids[subscription._uid]) {
				
					subscription.execute(subject, data, true);
					ids[subscription._uid] = true;
				};
			});
		};
	};
	
	// Subscription class
	var Subscription = function(subject, listener, hub, once) {
	
		this.subject = subject;
		this.listener = listener;
		this.useMsgObj = false;
		
		this._listening = true;
		this._before = null;
		this._after = null;
		this._uid = null;
		
		this._once = once;
		this._hub = hub;
	};
	
	Subscription.prototype.execute = function(subject, data, force) {
	
		if (force || this.subject === subject) {
			
			if (this.listener && this._listening) {
			
				var args;
			
				if (this.useMsgObj) args = [new Message(subject, data, this._uid)];
				else args = [subject, data]
				
				if (this._once) this._hub.un(subject, this.uid);
				if (this._before) this._before.apply(this, args);
				
				// we check again here as the before function could affect the properties
				if (this.listener && this._listening) {
					this.listener.apply(this, args);
				};
				
				if (this._after) this._after.apply(this, args);
			};
		};
	};
	
	Subscription.prototype.before = function(fn) {
		this._before = fn;
		return this;
	};
	
	Subscription.prototype.after = function(fn) {
		this._after = fn;
		return this;
	};
	
	Subscription.prototype.remove = function() {
		return this.setListener(null);
	};
	
	Subscription.prototype.pause = function() {
		this._listening = false;
		return this;
	};
	
	Subscription.prototype.resume = function() {
		this._listening = true;
		return this;
	};
	
	Subscription.prototype.set = function(key, value) {
	
		if (key !== 'subject' && key !== 'listener' && key !== 'useMsgObj') {
			throw 'Subscription illegal setter key: ' + key;
		};
		
		this[key] = value;
		
		if (key === 'subject') {
			if (!this._hub.subjects[value]) this._hub.subjects[value] = [];
			this._hub.subjects[value].push(this);
		};
		
		return this;
	};
	
	// generate setter/getter for public properties only
	['subject', 'listener', 'useMsgObj'].forEach(function(key) {
	
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
	
	// Message class
	var Message = function(subject, data, uid) {
		this.data = data || null;
		this.subject = subject || null;
		this.timestamp = new Date().getTime();
		this.uid = uid;
	};
	
	// build message getter methods
	['data', 'subject', 'timestamp', 'uid'].forEach(function(key) {
		(function(method, key) {
			Message.prototype['get' + method] = function() {
				return this[key];
			};
		})(firstUp(key), key);
	});
	
	// e.g subject => Subject
	function firstUp(str) {
		var len = str.length;
		return str.substring(0, 1).toUpperCase() + str.substring(1, len);
	};

	// Singleton and exposure
	window.MessageHub = MessageHub = new Hub();
	
	// Allow creation of new instances
	MessageHub.instance = function() {
		return new Hub();
	};

})();