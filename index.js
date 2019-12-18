
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
    if (env === 'local' || env === 'test' || !env) return winston

    // creating winston transport file instance
    const winstonTransportFile = new winston.transports.File({ filename: "logfile.log", level: 'error' })
    /**
     * in case of non local or test environment
     * add the File log
    */
    winston.add(winstonTransportFile);

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

    // creating winston transport file instance
    const winstonTransportFile = new winston.transports.File({ filename: "logfile.log", level: 'error' })

    // creating winston transport console instance
    const winstonTransportConsole = new winston.transports.Console({ level: 'info', format: winston.format.simple() })

    // logger 
    winston.configure({
        level: 'info',
        format: winston.format.json(),
        transports: [
            winstonTransportFile, //save errors on file
            winstonTransportConsole //log on console
        ],
        exitOnError: false // without it winston stops login after the first uncaught exception
    });

    /**
     * in case of local or test environment or no env at all
     */
    if (env === 'local' || env === 'test' || !env) return winston

    /**
     * in case of non local or test environment 
     * add the elasticsearch log
     * and remove the console log
     */
    winston.add(es);
    winston.remove(winstonTransportConsole);

    return winston
}

module.exports = shieldfyLogger