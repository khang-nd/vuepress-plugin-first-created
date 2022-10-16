const path = require('path')
const spawn = require('cross-spawn');

module.exports = (options = {}, context) => ({
  extendPageData ($page) {
    const { transformer, dateOptions } = options
    const timestamp = getGitFirstCommitTimeStamp($page._filePath)
    const $lang = $page._computed.$lang
    if (timestamp) {
      const firstCreated = typeof transformer === 'function'
        ? transformer(timestamp, $lang)
        : defaultTransformer(timestamp, $lang, dateOptions)
      $page.firstCreated = firstCreated
      $page.firstCreatedTimestamp = timestamp
    }
  }
})

function defaultTransformer (timestamp, lang, dateOptions) {
  return new Date(timestamp).toLocaleString(lang, dateOptions)
}

function getGitFirstCommitTimeStamp (filePath) {
  let firstCreated
  try {
    firstCreated = parseInt(spawn.sync(
      'git',
      ['log', '--diff-filter=A', '--format=%at', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')) * 1000
  } catch (e) { /* do not handle for now */ }
  return firstCreated
}