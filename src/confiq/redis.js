const {createClient} = require('redis');

const redisclient = createClient({
    username: 'default',
    password: process.env.Redis_Pass,
    socket: {
        host: 'redis-19816.c278.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 19816
    }

});

module.exports=redisclient;