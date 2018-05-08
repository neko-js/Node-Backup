This package is an equivalent to the [Python-Backup-Tool](https://github.com/smcgit/Python-Backup) and has been created for learning purposes.

# Backup Tool in Node.js

This package is used for creating backups of directories and/or files by calling a single command within Node.js.

The directories are backuped by creating uncompressed and password protected archives with 7-zip. The archive name will be the same name as the directory or file being backed up.

## Installation

First of all, 7-zip needs to be included in PATH, so the command `7z` becomes available. Type in `7z` to check if this is the case.

Installation of this package is done via npm.

```
npm install git+https://github.com/smcgit/Node-Backup.git
```

To uninstall this package type in:

```
npm uninstall node-backup
```

## Usage

Following command becomes available through this package:

```javascript
backup(paths_input, dir_output, pw)
```

* `paths_input` is a list of directories or files to backup.
* `dir_output` is an output directory for the 7z-files.
* `pw` is the password for the 7z-files (optional).

An example is given as such:

```javascript

var backup = require('node-backup').backup;

paths_input = [
	'folder1',
	'../folder2',
	'C:/folder/file1.zip'
	];
dir_output = 'D:/Backup';

backup(paths_input, dir_output);

```
