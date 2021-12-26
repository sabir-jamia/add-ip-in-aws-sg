const core = require("@actions/core");
const publicIp = require("public-ip");

async function getIPV4() {
  try {
    const ip = await publicIp.v4();
    core.info(`Runner's Public IPv4 is : ${ip}`);
    return ip;
  } catch (err) {
    core.setFailed(err.message);
  }
}

module.exports = { getIPV4 };
