
const Help = require('./help')
const Setup = require('./setup')
const LinkMic = require('./linkMic')
const UnlinkMic = require('./unlinkMic')
const Ready = require('./ready')
const Unready = require('./unready')
const Popflash = require('./popflash')
const Unpopflash = require('./unpopflash')
const Restart = require('./restart')
const Captain = require('./captain')
const Start = require('./start')
const Move = require('./move')
const VoiceChannel = require('./voicechannel')

module.exports = {
  /** Week 1 commands */
  Help, Setup, LinkMic, UnlinkMic, Ready, Unready, Popflash, Unpopflash,
  /** Week 2 commands */
  Restart, Captain, Start, Move, VoiceChannel
} 