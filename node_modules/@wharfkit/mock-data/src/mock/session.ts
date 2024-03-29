import {PermissionLevel} from '@wharfkit/antelope'

import {
    Session,
    SessionArgs,
    SessionKit,
    SessionKitArgs,
    SessionKitOptions,
    SessionOptions,
} from '@wharfkit/session'

import {mockChainDefinition, mockChainDefinitions, mockPermissionLevel} from './config'
import {mockFetch} from './fetch'
import {makeWallet} from './wallet'
import {MockStorage} from './storage'
import {MockUserInterface} from './userinterface'

const wallet = makeWallet()

export const mockSessionKitArgs: SessionKitArgs = {
    appName: 'unittest',
    chains: mockChainDefinitions,
    ui: new MockUserInterface(),
    walletPlugins: [wallet],
}

export const mockSessionKitOptions: SessionKitOptions = {
    fetch: mockFetch, // Required for unit tests
    storage: new MockStorage(),
}

export const mockSessionKit = new SessionKit(mockSessionKitArgs, mockSessionKitOptions)

export const mockSessionArgs: SessionArgs = {
    chain: mockChainDefinition,
    permissionLevel: PermissionLevel.from(mockPermissionLevel),
    walletPlugin: wallet,
}

export const mockSessionOptions: SessionOptions = {
    broadcast: false, // Disable broadcasting by default for tests, enable when required.
    fetch: mockFetch, // Required for unit tests
}

export const mockSession = new Session(mockSessionArgs, mockSessionOptions)
