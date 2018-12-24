// 当前缓存版本的唯一标识符，用当前时间代替
var cacheKey = new Date().toISOString();

// 设置当前缓存的白名单，在新的service workers中的install中将使用白名单的key
var cacheWhiteList = [cacheKey]

// 需要被缓存的文件的URL列表
var cacheFileList = [
  'index.html',
  'main.js',
  'style.css',
  'star-wars-logo.jpg',
  'images/bountyHunters.jpg',
  'images/myLittleVader.jpg',
  'images/snowTroopers.jpg' 
]

// 监听install事件，self即service workers实例
self.addEventListener('install', function(event) {

  // 所有资源缓存完成时
  event.waitUntil(

    // 打开缓存，返回要缓存的文件URL列表
    caches.open('cacheKey').then(function(cache) {
      
      return cache.addAll(cacheFileList);

    })
  )
})

// 拦截网络请求，复用缓存
self.addEventListener('fetch', function(event) {

  // 去缓存中查询对应的请求
  event.respondWith(caches.match(event.request)
    .then(function(response) {

      // 如果本地缓存存在，则直接返回本地缓存
      if (response) return response

      // 否则返回fetch下载资源
      else return fetch(event.request)

    })
  )
})

// 新的sw线程取得控制权后将会触发激活事件
self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(cacheName){
      return Promise.all(
        cacheName.map(function(cacheName){
          // 将不在白名单的缓存全部清理掉
          if(cacheWhiteList.lastIndexOf(cacheName) === -1){
            return caches.delete(cacheName) 
          }
        })
      )
    })
  )
})
