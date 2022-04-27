import styles from "./current.module.css"
import {useState, useEffect, useRef} from "react"
import Countdown from 'react-countdown';

import {
    
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as web3 from "@solana/web3.js"
require('@solana/wallet-adapter-react-ui/styles.css');

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      
        // Add event listener
        window.addEventListener("resize", handleResize);
       
        // Call handler right away so state gets updated with initial window size
        handleResize();
      
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

const Current = () => {
    const size = useWindowSize();
    const wallet = useWallet();
    const [walletAddr, setWalletAddr] = useState("")
    const [bal, setBal] = useState(0)
    const [entries, setEntries] = useState(null)
    const walletRef = useRef();
    walletRef.current  = wallet
    const connection = new Connection("https://summer-black-sun.solana-devnet.quiknode.pro/299eba8a7616239429817a494089b46229c325c8/", "confirmed");

    const [config, setConfig] = useState({
        endTime: 0
    })
    useEffect(() => {
        fetch("http://localhost:4444/currentRaffle")
        .then(r=>r.json())
        .then(r=>{
            setConfig(r.raffle);
            console.log(r.raffle); 
            console.log("Is time within: ", config.endTime <Date.now()/1000 > config.startTime)
            console.log(Date.now()/1000, config.endTime, config.startTime)
            console.log("Below end? : ", Date.now()/1000< config.endTime)
            console.log("After start? : ", Date.now()/1000> config.startTime)
        })
        .catch(e=>alert(e))
    }, [])

    useEffect(() => {
        async function getBal() {
            console.log("Triggered.......")

            if (
                walletRef.current.publicKey == null
            ) {
                console.log("Not connected")
                console.log(wallet)
                console.log(walletRef.current)
                return;
            }
            try {
                console.log("KETYT: ", walletRef.current.publicKey)
                const publicKey = walletRef.current.publicKey.toString();
                console.log("Pubkey: ", publicKey)
                setWalletAddr(publicKey.toString())
                const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
                const balance = await connection.getBalance(walletRef.current.publicKey);
                console.log("balance", balance / LAMPORTS_PER_SOL)
                setBal(balance / LAMPORTS_PER_SOL)
            } catch(e) {
                console.log(e)
            }
            
            
        }

        function getEntries() {
            try {
            fetch(`http://localhost:4444/entries/${walletRef.current.publicKey.toString()}/${config.raffleNumber}`)
            .then(r => r.json())
            .then(r=>{
                console.log("RESPONSE: ", r)
                setEntries(r["count"])
            })
            .catch(e => {

                console.log("ERROR: ", e)
            })
        } catch(e) {
            console.log(e)
        }
    }

        return () => {
            getBal()
            getEntries()
            
        }

    }, [wallet])
    async function enterRaffle() {
        console.log("Entering.....")
        const reciever = new web3.PublicKey("FumYkjqdYi6rb3bEKDxEbDMgkUQjRrriucyorA3Z5vTy")
        var sig = ""
        const recentBh = connection.getRecentBlockhash()
        const transaction = new web3.Transaction({recentBlockhash: (await recentBh).blockhash, feePayer: wallet.publicKey}).add(
            web3.SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: reciever,
                lamports: LAMPORTS_PER_SOL * config.entryPrice
            })
        )
        sig = await wallet.sendTransaction(transaction)
        console.log(`Signature: ${sig}`)
        
    }
    return (
        <div className={styles.container}>
            
            <div className={styles.top}>
                {
                    size.width > 1000 ? (
                        <>
                        <p className={styles.bal}>Balance: {bal.toFixed(2)}<span className={styles.grey}> SOL</span> </p>
                        <h1>Solana Raffle</h1>
                        {
                        wallet.publicKey === null ? (
                            <WalletMultiButton style={{textAlign: "center"}} />
                        ) : (
                            <button >{wallet.publicKey.toString().substring(0,16)} Connected</button>
                        )
                        }

                        </>
                    ) : (
                        <>
                        <h1>Solana Raffle</h1>
                        <div className={styles.mobCont}>
                        <p className={styles.bal}>Balance: {bal}<span className={styles.grey}> SOL</span> </p>
                        
                        {
                        !wallet.connected || !wallet.publicKey ? (
                            <WalletMultiButton className="btn" style={{textAlign: "center"}} />
                        ) : (
                            <button >{walletAddr.substring(0,16)} Connected</button>
                        )
                        }
                        </div>
                        </>
                    )
                }
                
            </div>
            <div className={styles.mid}>
                <div className={styles.featuredCont}>
                    
                    <div className={styles.imgDesc}>
                    <p>Featured</p>
                    <img src="/Rectangle.png" alt="Current" />
                    
                    </div>
                    <p className={styles.imgDescLower}>Rogue Shark #777</p>
                </div>
                <div className={styles.purchase}>
                    <div className={styles.potInfo}>
                        <p style={{fontSize: "20px", fontFamily: "Poppins"}}>Pot Value</p>
                        <p style={{fontSize: "40px", fontFamily: "Monteserrat"}}>10 <span className={styles.green}>SOL</span></p>
                        <p style={{fontSize: "20px", fontFamily: "Poppins"}}>🎉 2 Winners</p>
                    </div>
                    <div className={styles.info}>
                        {
                            config.endTime >Date.now()/1000 &&Date.now()/1000 > config.startTime ? (
                                <>
                                <p style={{color:"white", fontSize: "22px"}}><b>
                                    Live Now</b></p>
                                <p className={styles.faded}>Drop is currently live</p>
                                <p className={styles.faded}>{entries? `Entries: ${entries}/${config["maxEntriesPp"]}`:`Entries: 0/${config["maxEntriesPp"]}`}</p>
                                </>
                            ) : (
                                <>
                                <p style={{color:"white", fontSize: "22px"}}><b>
                                    Ended</b></p>
                                <p className={styles.faded}>The next Dip will start soon</p>
                                </>
                            )
                        }
                        
                    </div>
                    
                    <button disabled={(config.endTime > Date.now()/1000 > config.startTime)} onClick={enterRaffle}>
                        { config.endTime >Date.now()/1000 &&Date.now()/1000 > config.startTime? `Enter Now: ${config.entryPrice} sol`:"Raffle not live atm"}
                    </button>
                </div>
                
            </div>
        </div>
    )
}

export default Current;