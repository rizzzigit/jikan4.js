import { BaseClass } from '../resource/base'
import { Client } from '../core/client'
import { APIClient } from '../core/api'

export type HeartBeatStatus =
  | 'Healthy'
  | 'Learning'
  | 'Unhealthy'

export class HeartBeat extends BaseClass {
  public static parseStatus (data: any): HeartBeatStatus {
    switch (data?.toLowerCase().trim() || '') {
      case 'healthy': return 'Healthy'
      case 'learning': return 'Learning'
      case 'unhealthy': return 'Unhealthy'

      default: throw new Error(`Unknown status: ${data}`)
    }
  }

  public readonly status: HeartBeatStatus
  public readonly score: number
  public readonly down: boolean
  public readonly lastDowntime: Date | null

  public constructor (client: Client, data: any) {
    super(client)

    this.status = HeartBeat.parseStatus(data.status)
    this.score = data.score
    this.down = !!data.down
    this.lastDowntime = data.last_downtime ? new Date(data.last_downtime) : null
  }
}

export class HeartBeatMonitor extends BaseClass {
  protected APIClient: APIClient

  public async check () {
    const { APIClient, client } = this
    const responseData = await APIClient.request({
      cache: false,
      path: '/'
    })

    if (responseData.status === 200) {
      const { body: { myanimelist_heartbeat: heartBeat } } = responseData

      return new HeartBeat(client, heartBeat)
    }
  }

  public constructor (client: Client) {
    super(client)

    this.APIClient = client.APIClient
  }
}
