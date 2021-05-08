const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
  // app.use('/assign-portal-304303.appspot.com',
  //   createProxyMiddleware({
  //     target: 'https://storage.googleapis.com/',
  //     changeOrigin: true,
  //   }))
};