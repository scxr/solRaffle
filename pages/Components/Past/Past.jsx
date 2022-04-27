import styles from "./past.module.css"
import {GiReceiveMoney, GiTicket, GiPodiumWinner} from "react-icons/gi"

const Card = (imag) => {
    console.log(imag)
    return (
        <div className={styles.pastCard}>
            <img src={imag["imag"]} />
            <div className={styles.info}>
            <p className={styles.name}>Rogue Shark#123</p>
            <p className={styles.desc}>111 Entries</p>
            <p><GiReceiveMoney style={{color: "#13F093"}} /> 10 SOL</p>
            <p><GiTicket  style={{color: "#13F093"}}/>  1445 Tickets Sold</p>
            <p><GiPodiumWinner style={{color: "#13F093"}}/> 2 Winners</p>
            </div>
            
        </div>
    )
}

const Past = () => {
    return (
        <div className={styles.container}>
            <h1>Past Raffles</h1>
            <div className={styles.cardContainer}>
                <Card imag="/past1.png"/>
                <Card imag="/past2.png"/>
                <Card imag="/past3.png"/>
                <Card imag="/past3.png"/>
            </div>
            
        </div>
    )
}

export default Past;