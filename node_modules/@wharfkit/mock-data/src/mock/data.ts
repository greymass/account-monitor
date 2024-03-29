import {Session} from '@wharfkit/session'

import {makeClient} from './client'
import {mockSessionArgs, mockSessionOptions} from './session'
import {makeMockAction, makeMockActions, makeMockTransaction} from './transfer'

const client = makeClient()

export async function mockData(memo?: string) {
    const info = await client.v1.chain.get_info()
    const action = await makeMockAction(memo)
    const actions = await makeMockActions(memo)
    const transaction = await makeMockTransaction(info, memo)
    const session = new Session(mockSessionArgs, mockSessionOptions)
    return {
        action,
        actions,
        info,
        session,
        transaction,
    }
}
