/**
 * We.js i18n plugin api
 * Add routes for get and set translations in one we.js project
 */
const path = require('path');

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);
  // set plugin configs
  // plugin.setConfigs({
  // });

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
        const localesFolder = path.join(process.cwd(), 'config', 'locales');
        // get all locale files:
        req.we.utils.listFilesRecursive(localesFolder, (err, files)=> {
          const locales = {};

          req.we.utils.async
          .eachSeries(files, (file, next)=> {
            const nameParts = file.replace('.json', '').split('/');
            locales[nameParts[nameParts.length-1]] = require(file);
            next();
          }, function afterLoadAll() {
            res.status(200).send({ locales: locales });
          });
        });
      }
    });

    done();
  };

  return plugin;
};