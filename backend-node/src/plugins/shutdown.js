module.exports = async di => {
    console.info('Closing connections...');

    try {
        const connection = await di.get('queues.connection');

        await connection.close();

        process.exit(0);
    } catch (error) {
        console.error('Error on closing connections!');

        process.exit(1);
    }
};
