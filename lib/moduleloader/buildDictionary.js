/**
 * Module dependencies
 */

var _			= require('lodash'),
	includeAll	= require('include-all'),
	Err			= require('./errors');



/**
 * buildDictionary
 * 
 * Go through each object, include the code, and determine its identity.
 * Tolerates non-existent files/directories by ignoring them.

	@param {Object} options {
		dirname			:: the path to the source directory

		optional		:: if enabled, fail silently and return {} when source directory does not exist
						   or cannot be read (otherwise, an error will be thrown)
						   default: false

		depth			:: the level of recursion where modules will be included
						   defaults to infinity

		filter			:: only include modules whose FILENAME matches this regex
		pathFilter		:: only include modules whose FULL RELATIVE PATH matches this regex
						   (relative from the entry point directory)

		replaceExpr		:: in identity: use this regex to remove substrings like 'Controller' or 'Service'
						   and replace them with the value of `replaceVal`

		replaceVal		:: see above (default value === '')

		dontLoad		:: if `dontLoad` is set to true, don't run the module w/ V8 or load it into memory-- 
						   instead, return a tree representing the directory structure
						   (all extant file leaves are included as keys, with their value = `true`)
	}
 */

module.exports = function buildDictionary(options) {

	// Deliberately exclude source control directories
	if (!options.excludeDirs) {
		options.excludeDirs = /^\.(git|svn)$/;
	}

	var files = includeAll(options);
	var dictionary = {};

	// Iterate through each module in the set
	_.each(files, function(module, filename) {

		// Build a single module, treating each source module as containers pieces of a distributed object
		if (options.aggregate) {
			// Check that source module is a valid object
			if ( !_.isPlainObject(module) ) {
				throw Err.invalidModule;
			}

			_.extend(dictionary, module);
		}

		// Build the module dictionary
		else {
			var keyName = filename;

			// If a module is found but marked as undefined,
			// don't actually include it in the final dictionary
			if (typeof module === 'undefined') {
				return;
			}

			// Unless the identity is explicitly disabled, or `dontLoad` option is set,
			// If no 'identity' attribute was provided, take a guess based on the (case-insensitive) filename
			if (!options.dontLoad && options.identity !== false) {

				if (!module.identity) {

					if (options.replaceExpr) {
						module.identity = filename.replace(options.replaceExpr, options.replaceVal || '');
					}
					else module.identity = filename;
				}

				// globalId is the name of the variable for this module 
				// that will be exposed globally in Sails unless configured otherwise,
				
				// Generate `globalId` using the original value of module.identity
				module.globalId = module.identity;

				// `identity` is the all-lowercase version
				module.identity = module.identity.toLowerCase();

				// Keyname is how the module will be identified in the returned module tree
				keyName = module.identity;
			}


			// Save the module's contents in our dictionary object
			// (this will actually just be `true` if the `dontLoad` option is set)
			dictionary[keyName] = module;
		}
	});

	if (!dictionary) return {};
	return dictionary;
};