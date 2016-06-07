
exports.sendJSONResponse = function(res, statusCode, content){
	res.status(statusCode).json(JSON.stringify(content));
};