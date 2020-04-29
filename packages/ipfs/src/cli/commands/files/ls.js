'use strict'

const {
  asBoolean
} = require('../../utils')
const formatMode = require('ipfs-core-utils/src/files/format-mode')
const formatMtime = require('ipfs-core-utils/src/files/format-mtime')

module.exports = {
  command: 'ls [path]',

  describe: 'List mfs directories',

  builder: {
    long: {
      alias: 'l',
      type: 'boolean',
      default: false,
      coerce: asBoolean,
      describe: 'Use long listing format.'
    },
    'cid-base': {
      describe: 'CID base to use.'
    }
  },

  async handler (argv) {
    const {
      ctx: { ipfs, print },
      path,
      long,
      cidBase
    } = argv

    const printListing = file => {
      if (long) {
        print(`${formatMode(file.mode, file.type === 1)}\t${formatMtime(file.mtime)}\t${file.name}\t${file.cid.toString(cidBase)}\t${file.size}`)
      } else {
        print(file.name)
      }
    }

    for await (const file of ipfs.files.ls(path || '/')) {
      printListing(file)
    }
  }
}
