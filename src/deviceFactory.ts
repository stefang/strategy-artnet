import {
  DeviceFactory, DeviceConfig, HostConfig, Iotes, ClientConfig, createHostDispatchable,
} from '@iotes/core'
import { DeviceTypes, StrategyConfig } from './types'
import http from 'http'

export const createDeviceFactory = (
  host: { config: HostConfig<StrategyConfig>; connection: any },
  client: ClientConfig,
  iotes: Iotes,
): DeviceFactory<DeviceTypes> => {
  const { deviceSubscribe, hostDispatch } = iotes

  const createArtnetNode = async (
    device: DeviceConfig<'ARTNET_NODE'>,
  ) => {
    const { name } = device
    return device;
  }

  const createArtnetBridge = async (
    device: DeviceConfig<'ARTNET_BRIDGE'>,
  ) => {
    const { name } = device

    var options = {
      hostname: host.config.host,
      port: host.config.port,
      path: '/artnet-object',
      method: 'POST',
      headers: {}
    }

    deviceSubscribe(
      (state: any) => {
        if (state[name] && state[name]?.['@@iotes_storeId']) {
          console.log(`Artnet Universe Update:`)
          console.log(state[name]?.payload);
          const data = JSON.stringify(state[name]?.payload)
          options.headers = {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
          const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            res.on('data', d => {
              process.stdout.write(d)
            })
          })

          req.on('error', error => {
            console.error(error)
            hostDispatch(
              createHostDispatchable(
                host.config.name,
                'DEVICE_CONNECT',
                {
                  deviceName: name,
                  subscriptionPath: `${name}`,
                },
                { ...host.config },
                'ARTNET_BRIDGE',
                error ? { message: error.message, level: 'ERROR' } : null,
              ),
            )
          })

          req.write(data)
          req.end()
        }
      },
      [name],
    )

    return device
  }

  return {
    ARTNET_NODE: createArtnetNode,
    ARTNET_BRIDGE: createArtnetBridge,
  }
}
