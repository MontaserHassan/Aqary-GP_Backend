const Cache = require('node-cache');

const cache = new Cache();

function fetchSiteInfo() {
  return new Promise((resolve) => {
    resolve({
      siteName: `aqary${(new Date()).getTime()}`,
    });
  });
}

async function updateCache() {
  try {
    const siteInfo = await fetchSiteInfo();
    cache.set('siteInfo', siteInfo);
  } catch (error) {
    console.error('Error fetching site information:', error);
  }
}

// Get site information from the cache
function getSiteInfo() {
  const cachedData = cache.get('siteInfo');
  if (cachedData) {
    return cachedData;
  }
  updateCache();
  return null;
}

const initializeCache = () => {
  setInterval(updateCache, 10000);
};

module.exports = {
  getSiteInfo,
  initializeCache,
};
