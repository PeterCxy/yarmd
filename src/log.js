import * as winston from "winston"

export let logger = new winston.Logger({
  transports: [
      new winston.transports.Console({
        handleExceptions: false,
        colorize: true
      })
  ]
})