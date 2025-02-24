'use strict'
// Simple way to connect to MongoDB. The Mongoose is cached by NodeJs, so when you use it in multiple files, it will not connect to the database multiple times.
import mongoose from 'mongoose';

const connectString = 'mongodb://localhost:27017/shopDEV'

// Instance design pattern
class MongoDB {
    constructor() {
        this.connect();
    }
    connect() {
        if(true) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50 // AI me
        })
            .then(_ => console.log('Connected to MongoDB'))
            .catch(err => console.log('Error connect!'))
    }

    static getInstance() {
        if(!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }

        return MongoDB.instance;
    }
}

export default MongoDB;