/* eslint-disable sort-keys-fix/sort-keys-fix */
import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import type { Connector } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';

export interface InjectedWalletOptions {
  chains: Chain[];
}

const isInjected = (wallet: {
  id: string;
  connector: Connector;
  installed?: boolean;
  name: string;
}) =>
  wallet.installed &&
  ((wallet.connector instanceof InjectedConnector &&
    wallet.name === wallet.connector.name) ||
    wallet.id === 'coinbase');

export const injectedWallet = ({
  chains,
  ...options
}: InjectedWalletOptions & InjectedConnectorOptions): Wallet => {
  const providers = typeof window !== 'undefined' && window.ethereum?.providers;
  return {
    id: 'injected',
    name: 'Browser Wallet',
    iconUrl: async () => (await import('./injectedWallet.svg')).default,
    iconBackground: '#fff',
    hidden: ({ wallets }) =>
      providers
        ? providers.length === wallets.filter(isInjected).length
        : wallets.some(isInjected),
    createConnector: () => ({
      connector: new InjectedConnector({
        chains,
        options,
      }),
    }),
  };
};
