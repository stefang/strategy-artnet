import {
  DeviceFactory,
  HostConfig,
  Strategy,
  ClientConfig,
  DeviceConfig,
} from '@iotes/core'

import { DeviceTypes, StrategyConfig } from './types'
import { createDeviceFactory } from './deviceFactory'

export const dmxStrategy: Strategy<StrategyConfig, DeviceTypes> = ({
  hostDispatch,
  deviceDispatch,
  hostSubscribe,
  deviceSubscribe,
}) => async (
  hostConfig: HostConfig<StrategyConfig>,
  clientConfig: ClientConfig,
): Promise<DeviceFactory<DeviceTypes>> => {
  const connection = true

  return createDeviceFactory({ config: hostConfig, connection }, clientConfig, {
    hostDispatch,
    hostSubscribe,
    deviceDispatch,
    deviceSubscribe,
  })
}

export { DeviceTypes, StrategyConfig }
