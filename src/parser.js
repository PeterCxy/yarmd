"use strict"
import * as request from "request"
import * as jsdom from "jsdom"

// AUTOINDEX parser
export function parseIndex(url, callback) {
    request.get(url, (err, response, body) => {
        if (err != null) {
            callback(err, null)
        }
        jsdom.env(body, (err, window) => {
            if (err != null) {
                callback(err, null)
            }
            _parseIndex(window.document, callback)
        })
    })
}

function _parseIndex(document, callback) {
    if (!text(document.querySelector("title")).startsWith('Index of')) {
        callback(new Error('Not a valid Nginx autoindex page.'), null)
    }
    parsePreTag(document.getElementsByTagName("pre"), callback)
}

function parsePreTag(pre, callback) {
    if (pre == null || pre.length != 1) {
        callback(new Error("<pre> tag not found or too many <pre> tags."), null)
    }
    parseLinkTag(pre[0].getElementsByTagName("a"), callback)
}

function parseLinkTag(links, callback) {
    if (links == null || links.length == 0) {
        // Empty
        callback(null, [])
    }
    callback(
        null,
        Array.prototype.slice.call(links).map((link) => {
            return link.getAttribute('href')
        })
        .filter((href) => href != '../')
    )
}

function text(elem) {
    if (elem.childNodes != null && elem.childNodes.length > 0) {
        return elem.childNodes[0].nodeValue
    } else {
        return ""
    }
}