const Setup = require('./setup')
const Setting = require('../settings')

const newSettings = new Setting()

module.exports = class Restart {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const runSettup = new Setup(this.settings)
    message.guild.fetchMember(message.author).then(guildMember => {
      const checkAdmin = guildMember.hasPermission('ADMINISTRATOR')
      if(!checkAdmin) return

      message.reply('restarting setup!')
      
      this.settings.settings = newSettings.settings
      this.settings.state = newSettings.state
      runSettup.run(client, message)
    })
  }

}