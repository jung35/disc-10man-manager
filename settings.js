module.exports = class Settings {
  constructor() {
    this.settings = {
      pickStyle: [
        'ABBAABBA','ABABABAB'
      ],
      mapStyle: [
        'Captain Pick', 'Majority Vote'
      ],
      mapPool: [
        'de_cache', 'de_inferno', 'de_mirage',
        'de_dust2', 'de_overpass',
        'de_cbble', 'de_train',
        /*'de_nuke', 'de_canals'*/
      ],

      voiceChannels: {
        lobby: null,
        team_1: null,
        team_2: null
      },
    }

    this.state = {
      joinedUsers: [],
      linkMic: [],
      linkPopflash: {},
      pickStyle: 0,
      mapStyle: 0,
      mapPool: [0, 1, 2, 3, 4, 5, 6],
      setup: false,

      team_1: {
        captain: null,
        players: []
      },
      team_2: {
        captain: null,
        players: []
      },
      pickTurn: [],
      map: null,
      mapVote: {}
    }
  }
}