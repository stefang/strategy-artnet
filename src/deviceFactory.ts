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

  const createArtnetBrightsign = async (
    device: DeviceConfig<'ARTNET_BRIGHTSIGN'>,
  ) => {
    const { name } = device

    deviceSubscribe(
      (state: any) => {
        if (state[name] && state[name]?.['@@iotes_storeId']) {
          (window as any).dmx.send(state[name]?.payload);
        }
      },
      [name],
    )

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
          console.log(`Send Artnet Universe Update Over Bridge:`)
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
    ARTNET_BRIGHTSIGN: createArtnetBrightsign,
    ARTNET_BRIDGE: createArtnetBridge,
  }
}
