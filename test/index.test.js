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
            expect(error.message).toEqual('trying to use process.env.ELASTICSEARCH_HOST as host failed')
        }
    })

})