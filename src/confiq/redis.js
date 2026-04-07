const {createClient} = require('redis');

const redisclient = createClient({
    username: 'default',
    password: process.env.Redis_Pass,
    socket: {
        host: 'redis-12592.c15.us-east-1-4.ec2.cloud.redislabs.com',
        port: 12592
    }
});

module.exports=redisclient;