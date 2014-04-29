var _ = require("alloy/underscore")._;

exports.title = 'Alert';
exports.message = '';
exports.ok = 'OK';

exports.dialog = function(args){
	args = args || {};

	var dialog = Ti.UI.createAlertDialog({
		title: args.title || exports.title,
		message: args.message || exports.message,
		ok: args.ok || exports.ok
	});

	if (_.isFunction(args.callback)) {
		dialog.addEventListener('click', args.callback);
	}

	dialog.show();
};
