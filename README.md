# shieldfy-logger

winston-elasticsearh based logger client for log streaming

## Requirements

this package requires node >= 8.0.0

## Installing

Using npm:

```bash
$ npm install shieldfy-logger
```

Using yarn:

```bash
$ yarn add shieldfy-logger
```

## Example

```js
// import the package
const shieldfyLogger = require('shieldfy-logger');

// initialize the logger
const logger = shieldfyLogger('test-service', 'http://localhost:9200', 'development')

// const logger = shieldfyLogger('test-service')

// start sending logs :)
logger.info('test info log')

logger.error('test error log')
```

## Parameters

| parameter | required 	| defualt              	| description          |
|-----------|----------	|----------------------	|--------------------- |
| service   | true     	| _                    	| service name         |
| host      | false    	| process.env.LOG_HOST 	| elastic search host  |
| env       | false    	| process.env.APP_ENV  	| the run environment  |

## Contributions

Feel free to fork the repo and submit a PR :)

## License

[MIT](LICENSE)
