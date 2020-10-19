var dmxlib = require('dmxnet');

var myArgs = process.argv.slice(2);

var dmxnet = new dmxlib.dmxnet({
  verbose: 0,
});

var sender = dmxnet.newSender({
  ip: myArgs[0],
  port: myArgs[1],
  subnet: 0,
  universe: 0,
  net: 0,
});

process.on('message', (msg) => {
  console.log(msg);
  for (const [key, value] of Object.entries(msg)) {
    sender.prepChannel(parseInt(key), value);
  }
  sender.transmit();
});