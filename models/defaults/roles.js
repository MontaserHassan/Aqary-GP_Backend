const defaultRoles = [
  {
    role_name: 'Admin',
    rank: 1,
    actions: {
      canBlockUser: false,
      canDeletePropertyAds: false,
      canDeleteProperty: false,
      canShowDashboard: false,
    },
  },
  {
    role_name: 'User',
    rank: 3,
    actions: {
      canBlockUser: false,
      canDeletePropertyAds: false,
      canDeleteProperty: false,
      canShowDashboard: false,
    },
  },
  {
    role_name: 'Blocked User',
    rank: 0,
    actions: {
      canBlockUser: false,
      canDeletePropertyAds: false,
      canDeleteProperty: false,
      canShowDashboard: false,
    },
  },
];

module.exports = defaultRoles;