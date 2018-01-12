module.exports = class Popflash {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { author, mentions } = message

    const mention_members = mentions.members.array()

    if(mention_members.length > 1) return false

    const messageSplit = message.content.split(' ')
    if(messageSplit.length < 2) return

    let user = author
    let id = messageSplit[1].match(/(\d+)/g)

    if(mention_members.length == 1) {
      user = mention_members[0].user
      id = messageSplit[2].match(/(\d+)/g)
    }

    if(id == null) {
      message.reply('invalid popflash url/id!')
      return false
    }

    this.settings.state.linkPopflash[user.id] = id
    message.reply('linked popflash account!')
  }
}