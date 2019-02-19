/**
 * We.js i18n plugin api
 * Add routes for get and set translations in one we.js project
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);
  // plugin routes:
  plugin.setRoutes({
    'get /i18n/get-all-locales': {
      controller: 'i18n-api',
      action: 'getAllLocales',
      responseType: 'json',
      permission: true // ṕublic
    }
  });

  plugin.fastLoader = function fastLoader(we, done) {
    // controllers:
    we.controllers['i18n-api'] = new we.class.Controller({
      getAllLocales(req, res) {
        const locales = we.i18n.getCachedTranslations();
        res.status(200).send({ locales: locales });
      }
    });

    done();
  };

  return plugin;
};