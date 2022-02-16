const { MongoClient, ObjectId } = require('mongodb');
const { ErrorHandler, logger } = require('@src/utils');
const { config } = require('@src/config');

const uri = config.mongoDBUri;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(error => {
    if (error) {
        throw new ErrorHandler(500, 'Connection failed');
    }
});

async function find(dbName, collectionName, filter = {}) {
    let result;
    try {
        logger.info(`find w/ db: ${dbName}, collection: ${collectionName}`);
        logger.info(`find w/ filter: ${JSON.stringify(filter)}`);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        if (filter._id) {
            filter._id = ObjectId(filter._id);
        }
        result = await collection.find(filter).toArray();
    } catch (error) {
        throw new ErrorHandler(500, error);
    }

    logger.info(`find result: ${JSON.stringify(result)}`);
    logger.info(`find count result: ${result.length}`);
    return result;
}

async function insert(dbName, collectionName, data) {
    let insert;
    let result = {};
    try {
        logger.info(`insert w/ db: ${dbName}, collection: ${collectionName}}`);
        logger.info(`insert w/ data: ${JSON.stringify(data)}`);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        if (Array.isArray(data)) {
            logger.info(`insertMany`);
            insert = await collection.insertMany(data);
            result = insert.ops;
        } else {
            logger.info(`insertOne`);
            insert = await collection.insertOne(data);
            result = insert.ops[0];
        }
    } catch (error) {
        throw new ErrorHandler(500, error);
    }

    logger.info(`insert insertResult: ${JSON.stringify(insert)}`);
    logger.info(`insert insertedCount: ${insert.insertedCount}`);
    logger.info(`insert result: ${JSON.stringify(result)}`);
    return result;
}

async function update(dbName, collectionName, filter, data) {
    let update;
    let result = {};
    try {
        logger.info(`update w/ db: ${dbName}, collection: ${collectionName}`);
        logger.info(`update w/ filter: ${JSON.stringify(filter)}, data: ${JSON.stringify(data)}`);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        if (filter._id) {
            filter._id = ObjectId(filter._id);
            update = await collection.updateOne(filter, { $set: data });
            logger.info(`updateOne modified ${update.result.nModified}`);
        } else {
            update = await collection.updateMany(filter, { $set: data });
            logger.info(`updateMany modified ${update.result.nModified}`);
        }

        if (update.result.nModified > 0) {
            result = await collection.find(filter).toArray();
            if (update.result.nModified == 1) {
                result = result[0];
            }
        }
    } catch (error) {
        throw new ErrorHandler(500, error);
    }

    logger.info(`update updateResult: ${JSON.stringify(update)}`);
    logger.info(`update updatedCount: ${update.result.nModified}`);
    logger.info(`update result: ${JSON.stringify(result)}`);

    return result;
}

async function remove(dbName, collectionName, filter) {
    let result;
    try {
        logger.info(`remove w/ db: ${dbName}, collection: ${collectionName}`);
        logger.info(`remove w/ filter: ${JSON.stringify(filter)}`);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        if (filter._id) {
            filter._id = ObjectId(filter._id);
        }
        result = await collection.deleteMany(filter);
    } catch (error) {
        throw new ErrorHandler(500, error);
    }

    logger.info(`remove result: ${JSON.stringify(result)}`);
    logger.info(`remove deletedCount: ${result.deletedCount}`);
    return { deletedCount: result.deletedCount };
}

module.exports = {
    find,
    insert,
    update,
    remove
};
