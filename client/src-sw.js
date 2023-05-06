const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// caching js and css files requires workbox strategies to be installed. 
// to actually respond to requests with a cached response, we need to use a strategy called StaleWhileRevalidate
// this strategy will first check the cache for a response, and if it finds one it will return 
// SWR shows old data that's already there while getting new data from the server in the background. that way you don't have to wait for the new data to load before seeing something on the website 


precacheAndRoute(self.__WB_MANIFEST);

// the precacheandroute() method takes an array of URLs to precache. the self.WB_Manifest is an array that contains the list of URLs to precache. the self ._WB_MANIFEST is an array that contains the list of URLs to precache. 
// it is a tool that helps to make sure your website still works even if you lose your internet connection. it works by downloading and saving parts of your website when you first visit it. 


const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});


warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});


// add asset caching 
// asset caching makes websites load faster and saves data usage
registerRoute(
  // define the callback function here that will filter the requests we want to cache (here it is the JS and CSS files)
  ({ request }) => ["style","script", "image"].includes(request.destination), 
  new StaleWhileRevalidate({
    // name of the cache storage
    cacheName: "asset-cache",
    plugins: [
      // plugin will cache responses with these headers to a max age of 30 days 
      new CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ],
  })
);




