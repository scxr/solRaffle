import styles from "./nav.module.css"
import {AiOutlineTwitter} from "react-icons/ai"
import {SiDiscord} from "react-icons/si"
const Nav = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
            <div className={styles.padding}></div>
            <div className={styles.titleContainer}>
                <img src="/logo.png" />
                <p>Solana</p>
            </div>
            <div className={styles.icons}>
                <div className={styles.twitterBg}>
                    <AiOutlineTwitter size={30}/>
                </div>
                <div className={styles.discordBg}>
                    <SiDiscord size={30} />
                </div>
            </div>
            </div>
            
        </div>
    )
}

export default Nav;