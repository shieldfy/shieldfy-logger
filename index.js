
/**
 * used to stream logs to elasticsearch server
 * @param {Object} config {
 *      
 *      host
 *      env 
 * } 

 * 
 * @returns {Logger} {
 *      info: Function,
 *      error: Function
 * }
 */
const shieldfyLogger = ({ service, host = process.env.LOG_HOST, env = process.env.APP_ENV }) => {
    // throw err if no service name
    if (!service) throw new Error('service name is required')
    // throw err if no host param and no LOG_HOST in env
    if (!host && !process.env.LOG_HOST) throw new Error('trying to use process.env.LOG_HOST as host failed')
    // throw err if no env param and no APP_ENV in env
    if (!env && !process.env.APP_ENV) throw new Error('trying to use process.env.APP_ENV as env failed')

    const winston = require('winston');
    const Elasticsearch = require('winston-elasticsearch');

    // elastic search config
    const esTransportOpts = {
        level: 'info',
        clientOpts: {
            node: host,
            log: "info"
        },
        transformer: logData => {
            const transformedData = {
                "@timestamp": new Date().toISOString(),
                severity: logData.level,
                service: service,
                environment: env,
                message: logData.message.toString(),
                fields: {}
            }
            return transformedData
        }
    };

    // creating es instance
    const es = new Elasticsearch(esTransportOpts)

    // creating winston transport instance
    const winstonTransport = new winston.transports.File({ filename: "logfile.log", level: 'error' })

    // logger 
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            winstonTransport, //save errors on file
            es //everything info and above goes to elastic
        ],
        exitOnError: false // without it winston stops login after the first uncaught exception
    });

    // we also log to console if we're not in production
    if (env !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    return logger
}

module.exports = shieldfyLogger