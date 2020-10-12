const winston = require('winston');

const Logger = {
    _logger: null,

    init: function() {
        this._logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            // format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.File({ filename: 'logs.log', timestamp: true }),
            ],
        });

        return this._logger;
    },

    log: function(message) {
        this._logger.log({
            level: 'info',
            message: message
        });
    }
}


module.exports = Logger;