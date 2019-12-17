describe('logger test', () => {
    
    test('service error', () => {
        try {
            const logger = require('../')() 
        } catch (error) {
            expect(error.message).toEqual('service name is required')
        }
    })

    test('host error', () => {
        try {
            const logger = require('../')({service: 'test'})
        } catch (error) {
            expect(error.message).toEqual('trying to use process.env.LOG_HOST as host failed')
        }
    })

    test('host error', () => {
        try {
            const logger = require('../')({service: 'test', host: 'localhost'})
        } catch (error) {
            expect(error.message).toEqual('trying to use process.env.APP_ENV as env failed')
        }
    })

})