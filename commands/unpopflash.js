const Discord = require('discord.js')

module.exports = class Unpopflash {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { author, mentions } = message

    const mention_members = mentions.members.array()

    if(mention_members.length > 0) {
      mention_members.map(user => {
        delete this.settings.state.linkPopflash[user.id]
      })
    } else {
      delete this.settings.state.linkPopflash[author.id]
    }

    message.reply('unlinked popflash account!')
  }
}