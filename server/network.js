const os = require('os');

// Devuelve las IPs IPv4 "de red local" de esta máquina (wifi, ethernet, etc.),
// descartando localhost y adaptadores virtuales típicos.
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    const isVirtual = /virtual|vmware|vbox|docker|veth|loopback/i.test(name);
    if (isVirtual) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        ips.push(addr.address);
      }
    }
  }
  return ips;
}

module.exports = { getLocalIPs };
