/**
 * Public dependencies.
 */

var _ = require('lodash'),
	util = require('sails-util');


/**
 * Expose `controllers` hook definition
 */
module.exports = function(sails) {

	/**
	 * Private dependencies.
	 */
	// var onRoute = require('./onRoute')(sails);



	return {

		defaults: {},

		// Don't allow sails to lift until ready
		// is explicitly set below
		ready: false,


		/**
		 * Initialize is fired first thing when the hook is loaded
		 *
		 * @api public
		 */

		initialize: function(cb) {

			// Register route syntax for binding controllers.

			// Load controllers from app and register their actions as middleware.
			this.loadAndRegisterSequelize(cb);
		},

		explicitActions: {},

		/**
		 * Wipe everything and (re)load middleware from controllers
		 *
		 * @api private
		 */

		loadAndRegisterSequelize: function(cb) {
			var self = this;

			// Remove all controllers from middleware hash,
			// but retain the reference between this and sails.middleware.controllers
			/*_.each(_.keys(self.middleware), function(key) {
				delete self.middleware[key];
			});*/

			// Load app controllers
			sails.modules.loadSequelize(function modulesLoaded(err, modules) {
				//所有的sequelize
				/*console.log('##############4');
		            console.log(modules);
		            console.log('##############4');*/
		            console.log('##############13');
		            console.log(JSON.stringify(Object.keys(modules)));
		            console.log('##############13');
						if (err) return cb(err);
				sails.sequelize = {};
				_.each(modules, function(value, key) {
					sails.sequelize[(key||"").replace(/[\/|\\]/g,'.')] = value;
				});
				console.log('##############12');
		            console.log(JSON.stringify(Object.keys(sails.sequelize)));
		            console.log('##############12');
				// Done!
				return cb();
			});
		}
	};


};