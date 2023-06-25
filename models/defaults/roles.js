const defaultRoles = [
  {
    role_name: 'Admin',
    actions: {
      roleRank: 1,
      canBlockUser: false,
      canDeletePropertyAds: false,
      canDeleteProperty: false,
      canShowDashboard: false,
    },
  },
  {
    role_name: 'User',
    actions: {
      roleRank: 3,
      canBlockUser: false,
      canDeletePropertyAds: false,
      canDeleteProperty: false,
      canShowDashboard: false,
    },
  },
  {
    role_name: 'Blocked User',
    actions: {
      roleRank: 0,
      canBlockUser: false,
      canDeletePropertyAds: false,
      canDeleteProperty: false,
      canShowDashboard: false,
    },
  },
];

module.exports = defaultRoles;