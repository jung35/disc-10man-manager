const Discord = require('discord.js')

module.exports = class LinkMic {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { author, mentions, channel } = message

    const mention_members = mentions.members.array()

    if(mention_members.length > 2 || mention_members.length < 1) return false

    if(mention_members.length == 1) {
      if(author.id == mention_members[0].user.id) {
        return message.reply('you can\'t link yourself!')
      }

      if(this.checkContains(author, mention_members[0].user)) {
        return message.reply('either you or the microphone is already linked!')
      }

      this.settings.state.linkMic.push([author.id, mention_members[0].user.id])
    }

    if(mention_members.length == 2) {

      if(this.checkContains(mention_members[0].user, mention_members[1].user)) {
        return message.reply('one of the account is already linked!')
      }

      this.settings.state.linkMic.push([
        mention_members[0].user.id, mention_members[1].user.id
      ])
    }

    message.reply('microphone account has successfully linked!')
  }

  checkContains(user1, user2) {
    for(let i = 0; i < this.settings.state.linkMic.length; i++) {
      const temp = this.settings.state.linkMic[i]
      if(temp.indexOf(user1.id) > -1 || temp.indexOf(user2.id) > -1) {
        return true
      }
    }

    return false
  }
}