const Discord = require('discord.js')

module.exports = class UnlinkMic {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { author, mentions } = message

    let micPosition = -1
    const mention_members = mentions.members.array()

    if(mention_members.length > 0) {
      mention_members.map(user => {
        micPosition = -1
        for(let i = 0; i < this.settings.state.linkMic.length; i++) {
          const temp = this.settings.state.linkMic[i]
          if(temp.indexOf(user.id) > -1) {
            micPosition = i
            break
          }
        }

        this.settings.state.linkMic.splice(micPosition, 1)
      })

      message.reply('the accounts were unlinked!')
      return false
    }

    micPosition = -1
    for(let i = 0; i < this.settings.state.linkMic.length; i++) {
      const temp = this.settings.state.linkMic[i]
      if(temp.indexOf(author.id) > -1) {
        micPosition = i
      }
    }

    if(micPosition == -1) {
      message.reply('you don\'t have any microphone linked!')
      return false
    }

    this.settings.state.linkMic.splice(micPosition, 1)


    message.reply('your account was unlinked!')
  }
}