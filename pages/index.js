import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Nav from './Components/Nav/Nav'
import Current from './Components/Current/Current'
import Past from './Components/Past/Past'
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,

} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { useMemo } from 'react'
export default function Home() {
	const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => "https://summer-black-sun.solana-devnet.quiknode.pro/299eba8a7616239429817a494089b46229c325c8/", [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),

        ],
        [network]
    );
  return (
		<>
			<div className={styles.parentCont}>
			<Nav />
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} >
					<WalletModalProvider>
						<Current />
					</WalletModalProvider>
				</WalletProvider>
        	</ConnectionProvider>
			<Past />
			</div>
		</>
  )
}
