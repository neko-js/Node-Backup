(function () {

	// Required modules
	var path = require('path');
	var fs = require('fs');
	var nrc = require('node-run-cmd');

	// Example call (mostly for testing purpose)
	function example() {
		backup(['gulpfile.js'], 'output/');
	}

	// Backup function to create 7z files of the elements in paths_input in the directory dir_output with the password pw
	function backup(paths_input, dir_output, pw) {

		// Settings for the compression
		var settings = {
			mx0: true, // no compression
			t7z: true, // use 7z for any filename
		};
		// If password is given
		if (pw !== undefined) {
			settings.p = pw;
			settings.mhe = true; // encrypt headers
		}

		// Zip all input paths
		paths_input.forEach(function (path_input) {
			// Generate an output path from path_input
			var filename = path.basename(path_input);
			if (['', '.', '..'].includes(filename)) {
				filename = 'Backup.7z';
			} else {
				filename = filename + '.7z';
			}

			// Normalize paths
			path_input = path.normalize(path_input);
			path_output = path.normalize(dir_output) + filename;
			path_output_tmp = path_output + '.tmp';

			// Check if already an output file with the same name exists
			if (fs.existsSync(path_output)) {
				// Delete old tmp file if it exists
				if (fs.existsSync(path_output_tmp)) {
					console.log('Removing old temporary file', path_output_tmp);
					fs.unlinkSync(path_output_tmp);
				}
				// Rename existing output to the tmp file
				console.log('Creating temporary file of current backup.', path_output_tmp);
				fs.renameSync(path_output, path_output_tmp);
			}

			// Zip it
			console.log('Creating for:', path_input);
			zip(path_input, path_output, settings, onSuccessfulZip);

			function onSuccessfulZip(successful) {
				if (successful) {
					console.log('7-zip was successful.');
					console.log('Removing old temporary file.', path_output_tmp);
					if (fs.existsSync(path_output_tmp)) {
						fs.unlinkSync(path_output_tmp);
					}
				}
				else{
					console.log('7-zip was NOT successful.');
				}
			}
		});
	}

	// Zip command
	function zip(path_input, path_output, settings, onSuccess, onError) {
		var successful = false;

		// Options for 7zip
		command = '7z a "' + path_output + '" "' + path_input + '"' + settings2str(settings);

		// Options for nrc
		options = {
			verbose: true,
			logger: function (output) {
				output.split('\n').forEach(function (line) {
					console.log('[7zip Output]', line);
					if (line.includes('Everything is Ok')) {
						successful = true;
					}
				});
			}
		};

		// Run command line
		nrc.run(command, options)
		.then(function (exitCodes) {
			if (onSuccess === undefined) {
				console.log('Command finished with exitCodes: ', exitCodes);
				console.log('command:', command);
				console.log('7-zip successful?', successful);
			} else {
				onSuccess(successful);
			}
		}, function (err) {
			if (onError === undefined) {
				console.err(err);
			}
		});
	}

	// Convert settings from object to string for Zip-command
	function settings2str(settings) {
		var str = '';
		for (var key in settings) {
			var val = settings[key];
			if (typeof val === 'boolean' && val === true) {
				str += ' -' + key;
			} else if (typeof val === 'string') {
				str += ' -' + key + val;
			}
		}
		return str;
	}

	// If this is main file
	if (require.main === module) {
		example();
	}

	// Export these functions
	exports.backup = backup;

})();
