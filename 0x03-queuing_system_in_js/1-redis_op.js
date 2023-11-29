import { get } from 'express/lib/response';
import { client } from 'kue/lib/redis';
import { createClient, print } from 'redis';

function connectToRedis() {
    const client = createClient();

    client.on('connect', () => {
        console.log('Redis client connected to the server');
      });
    
      client.on('error', (err) => {
        console.log(`Redis client not connected to the server: ${err.message}`);
      });
};

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, print)
};

function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, value) => {
        if (err) throw err;
        console.log(`The value of the key ${schoolnam} is : ${value}`);
    });
};
