"use strict"
import * as optimist from "optimist"
import * as process from "process"
import * as fs from "fs"
import * as path from "path"
import { parse as parseURL } from "url"
import { logger } from "./log"
import { recursiveDownload } from "./download"

let argv = optimist
  .usage('Usage: yarmd [-h] [-n count] [-d directory] URL\n\nYet Another Recursive Multi-thread Downloader. This program downloads recursively from an Nginx server with autoindex enabled.\nIf you want to resume a previous download, just make sure the parameters remain the same.\nPlease note that this program ONLY supports servers with NGINX autoindex, and it requires Aria2 to work!')
  .alias('n', 'threads')
  .alias('d', 'directory')
  .alias('h', 'help')
  .describe('n', 'The number of threads while downloading a file.')
  .describe('d', 'Directory to download into. YARMD will create a new directory in that directory named with the directory to download.')
  .describe('h', 'Print help information')
  .boolean('h')
  .default('n', 3)
  .default('d', process.cwd())
  .default('h', false)
  .argv

main()

function main() {
    if (argv.help) {
        console.log(optimist.help())
        process.exit(0)
    }
    
    if (argv._.length == 0 || argv._[0] == null || argv._[0] == "") {
        logger.error('No URL provided.')
        console.log(optimist.help())
        process.exit(1)
    }

    argv.directory = path.resolve(argv.directory)
    if (!fs.existsSync(argv.directory)) {
        logger.error(`Directory ${argv.directory} does not exist.`)
        process.exit(1)
    }

    // Validate the URL first
    let url = argv._[0].trim()
    if (!url.endsWith('/')) {
        logger.info('Adding a trailing / automatically.')
        url += '/'
    }
    url = parseURL(url)

    if (url.protocol != "http:" && url.protocol != "https:") {
        logger.error('Only HTTP and HTTPS are supported')
        process.exit(1)
    }

    if (url.hostname == null || url.hostname.trim() == "") {
        logger.error('No host provided')
        process.exit(1)
    }

    recursiveDownload(argv.directory, url, argv.threads)
}