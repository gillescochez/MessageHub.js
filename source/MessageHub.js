(function() {

	// Hub class
	var Hub = function() {
		this.subjects = {};
		this._uid = 0;
	};

	Hub.prototype.subscribe = Hub.prototype.on = function(subject, listener, once) {
	
		var subscription;
		
		if (!this.subjects[subject]) this.subjects[subject] = [];
		subscription = new Subscription(subject, listener, this, once);
		subscription._uid = this._uid++;
		this.subjects[subject].push(subscription);
		
		return subscription;
	};
	
	Hub.prototype.once = function(subject, listener) {
		return this.on(subject, listener, true);
	};

	Hub.prototype.unsubscribe = Hub.prototype.un = function(subject, uid) {
	
		var items, len, i;
		
		if (this.subjects[subject]) {
		
			if (!uid) {
				this.subjects[subject] = null;
				delete this.subjects[subject];
				return;
			};
		
			items = this.subjects[subject];
			len = items.length;
			i = 0;
			
			for (; i < len; i++) {
				if (items[i]._uid === uid) {
					items.splice(i, 1);
				};
			};
			
			if (this.subjects[subject].length < 1) {
				this.subjects[subject] = null;
				delete this.subjects[subject];
			};
		};
	};

	Hub.prototype.publish = Hub.prototype.emit = function(subject, data) {
	
		if (this.subjects[subject]) {
		
			this.subjects[subject].forEach(function(subscription) {
				subscription.execute(subject, data);
			});
		};
	};

	Hub.prototype.publishToAll = Hub.prototype.spam = function(subject, data) {
	
		for (var sub in this.subjects) {
			this.subjects[sub].forEach(function(subscription) {
				subscription.execute(subject, data, true);
			});
		};
	};
	
	// Subscription class
	var Subscription = function(subject, listener, hub, once) {
	
		this.subject = subject;
		this.listener = listener;
		
		this._listening = true;
		this._once = once;
		this._hub = hub;
		this._before = null;
		this._after = null;
		this._uid = null;
	};
	
	Subscription.prototype.execute = function(subject, data, force) {
	
		if (force || this.subject === subject) {
			
			if (this._before) this._before.apply(this, [subject, data]);
			
			if (this.listener && this._listening) {
			
				this.listener.apply(this, [subject, data]);
				
				if (this._once) {
					this._hub.un.apply(this._hub, [this.subject, this._uid]);
				};
			};
			
			if (this._after) this._after.apply(this, [subject, data]);
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
	
	Subscription.prototype.setListener = function(listener) {
		return this.set("listener", listener);
	};
	
	Subscription.prototype.setSubject = function(subject) {
		return this.set("subject", subject);
	};
	
	Subscription.prototype.set = function(key, value) {
	
		if (key !== "subject" && key !== "listener") {
			throw "Subscription illegal setter key: " + key;
		};
		
		this[key] = value;
		
		if (key === "subject") {
			if (!this._hub.subjects[value]) this._hub.subjects[value] = [];
			this._hub.subjects[value].push(this);
		};
		
		return this;
	};

	// Singleton and exposure
	window.MessageHub = MessageHub = new Hub();

})();