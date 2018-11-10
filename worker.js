
var CACHE = 'tightydeadline-cache';
var precacheFiles = [
	"index.html",
	"sprites.png",
	"wallpaper.png",
	"music/coolmusax.mp3",
	"music/finalvoice.mp3",
	"music/hollow.mp3",
	"music/kinetix.mp3",
	"music/strollingcats.mp3"
];

self.addEventListener('install', function(evt) {
	evt.waitUntil(precache().then(function() {
			return self.skipWaiting();
	})
	);
});


self.addEventListener('activate', function(event) {
			return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
	evt.respondWith(fromCache(evt).catch(fromServer(evt.request)));
	evt.waitUntil(update(evt.request));
});


function precache() {
	return caches.open(CACHE).then(function (cache) {
		return cache.addAll(precacheFiles);
	});
}

function fromCache(evt) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(evt.request).then(function (matching) {
			return matching || fetch(evt.request).then(function(response) {
					cache.put(evt.request, response.clone());
					return response;
				});
		});
	});
}

function update(request) {
	return caches.open(CACHE).then(function (cache) {
		return fetch(request).then(function (response) {
			return cache.put(request, response);
		});
	});
}

function fromServer(request){
	return fetch(request).then(function(response){ return response})
}