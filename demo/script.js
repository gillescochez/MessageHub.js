var subscription = MessageHub.on("demo", function(msgObj) {
	console.log(
		"Subject: " + msgObj.getSubject() +
		" fooStr: " + msgObj.getData().fooStr +
		" Time: " + new Date(msgObj.getTimestamp()) +
		" Subscription unique ID: " + msgObj.getUid()
	);
	console.log(msgObj);
});

MessageHub.emit("demo", {
	fooStr: 'foo'
});

/*

var str = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
str += str.toUpperCase();

var chars = str.split(',');

chars.forEach(function(c, i) {

	MessageHub.subscribe(c, function(data) {
	
		var div = document.createElement('div'),
			a = document.createElement('a');
		
		a.href = "#";
		a.innerText = data.subject;
		a.onclick = function(ev) {
			ev.preventDefault();
			console.log(c);
		};
		div.appendChild(a);
		document.body.appendChild(div);
	});
	
	(function(c) {
		setInterval(function() {
			MessageHub.emit(c, {foo:c});
		}, 1);
	})(c);
	
});

*/