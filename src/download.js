"use strict"
import * as fs from "fs"
import * as path from "path"
import { parse as parseURL } from "url"
import { logger } from "./log"
import { parseIndex } from "./parser"
import { execSync } from "child_process"

export function recursiveDownload(dir, url, threads) {
    logger.info(`Parsing index: ${hrefWithoutAuth(url)}`)
    parseIndex(url.href, (err, index) => {
        if (err != null) {
            throw err
        }
        if (index == null || index.length == 0) {
            logger.info(`Empty directory. Aborting.`)
            return
        }
        let pathName = path.join(dir, '/' + urlToDir(url))
        fs.exists(pathName, (exists) => {
            if (!exists) {
                fs.mkdir(pathName)
            }
            _recursiveDownload(pathName, index, url, threads)
        })
    })
}

function _recursiveDownload(pathName, index, baseURL, threads) {
    let pending = []
    index.forEach((f) => {
        if (f.endsWith('/')) {
            // A directory
            pending.push(f)
        } else {
            // Download this file
            let fileURL = baseURL.href + f
            logger.info(`Downloading ${hrefWithoutAuth(url)}${f}`)
            let fileName = path.join(pathName, '/' + f)
            let aria2File = fileName + '.aria2'
            if (!fs.existsSync(fileName) || (fs.existsSync(fileName) && fs.existsSync(aria2File))) {
                execSync(`aria2c -s ${threads} -d '${pathName}' '${fileURL}'`, {stdio:[0,1,2]})
            }
        }
    })
    pending.forEach((d) => recursiveDownload(pathName, parseURL(baseURL.href + d), threads))
}

function hrefWithoutAuth(url) {
    return `${url.protocol}${url.port != null ? ':' + url.port : ''}//${url.hostname}${url.path}`
}

function urlToDir(url) {
    if (url.path == null || url.path == '') {
        return url.hostname
    } else {
        return _urlToDir(url.path.split('/'))
    }
}

function _urlToDir(arr) {
    return decodeURIComponent(arr[arr.length > 1 ? arr.length - 2 : arr.length - 1])
}