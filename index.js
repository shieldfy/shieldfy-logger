
/**
 * used to stream logs to elasticsearch server
 * @param {Object} config {
 *      service
 *      host
 *      env 
 * } 

 * 
 * @returns {Logger} {
 *      info: Function,
 *      error: Function
 * }
 */
const shieldfyLogger = (config = {}) => {
    let { service, host = process.env.ELASTICSEARCH_HOST, env = process.env.APP_ENV } = config
    // throw err if no service name
    if (!service) throw new Error('service name is required')
    // throw err if no host param and no ELASTICSEARCH_HOST in env
    if (!host && !process.env.ELASTICSEARCH_HOST) throw new Error('trying to use process.env.ELASTICSEARCH_HOST as host failed')

    const winston = require('winston');
    const Elasticsearch = require('winston-elasticsearch');

    // creating winston transport console instance
    const winstonTransportConsole = new winston.transports.Console({ level: 'info', format: winston.format.simple() })

    // logger 
    winston.configure({
        level: 'info',
        format: winston.format.json(),
        transports: [
            winstonTransportConsole //log on console
        ],
        exitOnError: false // without it winston stops login after the first uncaught exception
    });

    /**
     * in case of local or test environment or no env at all
     */
    if (!env || env === 'local' || env === 'test') return winston

    // elastic search config
    const esTransportOpts = {
        level: 'info',
        clientOpts: {
            host: host,
            log: "info"
        },
        transformer: logData => {
            const transformedData = {
                "@timestamp": new Date().toISOString(),
                severity: logData.level,
                service: service,
                environment: env,
                message: `${logData.message}`,
                fields: {}
            }
            return transformedData
        }
    };

    // creating es instance
    const es = new Elasticsearch(esTransportOpts)

    // adiing close the es functionality
    // usefull in case of a lambda function
    winston.close = () => es.bulkWriter.schedule = () => { };
    // creating winston transport file instance
    const winstonTransportFile = new winston.transports.File({ filename: "logfile.log", level: 'error' })

    /**
     * in case of non local or test environment 
     * add the elasticsearch log
     * add the file log
     * and remove the console log
     */
    winston.add(es);
    winston.add(winstonTransportFile);
    winston.remove(winstonTransportConsole);

    return winston
}

module.exports = shieldfyLogger