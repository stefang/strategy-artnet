import {
  DeviceFactory, DeviceConfig, HostConfig, Iotes, ClientConfig,
} from '@iotes/core'
import { DeviceTypes, StrategyConfig } from './types'
import artnet from 'artnet'

export const createDeviceFactory = (
  host: { config: HostConfig<StrategyConfig>; connection: any },
  client: ClientConfig,
  iotes: Iotes,
): DeviceFactory<DeviceTypes> => {
  const { deviceSubscribe, hostDispatch } = iotes

  const createArtnetFixture = async (
    device: DeviceConfig<'ARTNET_FIXTURE'>,
  ) => {
    const { name } = device
    artnet.setHost(host.config.host)
    artnet.setHost(host.config.port)

    deviceSubscribe(
      (state: any) => {
        if (state[name] && state[name]?.['@@iotes_storeId']) {
          Object.entries(state[name]?.payload).forEach(entry => {
            const [key, value] = entry;
            artnet.set(key, value);
          });
          artnet.close();
          console.log(`Artnet Universe Update: ${JSON.stringify(state[name]?.payload)}`)
        }
      },
      [name],
    )

    return device
  }

  return {
    ARTNET_FIXTURE: createArtnetFixture,
  }
}
