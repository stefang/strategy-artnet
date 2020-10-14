import {
  HostConfig,
  DeviceConfig,
  Iotes,
  ClientConfig,
} from '@iotes/core'

export type DeviceTypes = 'ARTNET_NODE' | 'ARTNET_BRIDGE'

export type StrategyConfig = {}

// interface GenericDevice {
//   name: string
//   type: string
// }

// // Device
// export type Device<StrategyConfig, DeviceType> = (
//   host: { config: HostConfig<StrategyConfig>; connection: any },
//   client: ClientConfig,
//   iotes: Iotes,
// ) => (device: DeviceConfig<DeviceType>) => Promise<DeviceConfig<DeviceType>>

// export namespace DmxFixture {
//   export type Type = 'ARTNET_BRIDGE'
//   export interface Device extends GenericDevice {
//     type: Type
//   }
// }
