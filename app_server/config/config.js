var apiOptions = {
	server: 'http://localhost:3000'
};

if(process.env.NODE_ENV === 'production'){
  apiOptions.server = 'https://shrouded-gorge-10239.herokuapp.com';
}

exports.serverUrl = apiOptions.server;