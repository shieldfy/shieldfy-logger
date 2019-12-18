# shieldfy-logger

winston and winston-elasticsearh based logger client for log streaming

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
const logger = shieldfyLogger({ service: 'test-service', host:'http://localhost:9200', env: 'development'})

// const logger = shieldfyLogger({ service: 'test-service' })

// start sending logs :)
logger.info('test info log', { staus: 'success' })

logger.error('test error log',  { staus: 'error' })
```

**note:** if you want to attach data , pass it in the second parameter. If you pass it by the first parameter it will be strignified and mutated.

## Parameters

| parameter | required | defualt                        | description         |
| --------- | -------- | ------------------------------ | ------------------- |
| service   | true     | _                              | service name        |
| host      | false    | process.env.ELASTICSEARCH_HOST | elastic search host |
| env       | false    | process.env.APP_ENV            | the run environment |

## Contributions

Feel free to fork the repo and submit a PR :)

## License

[MIT](LICENSE)
