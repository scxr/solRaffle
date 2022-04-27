import styles from "./admin.module.css"
import { useState } from "react"
const AdminPanel = () => {
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [entryPrice, setEntryprice] = useState(null)
    const [maxPp, setMaxPp] = useState(null)
    const [maxTotal, setMaxTotal] = useState(null)
    const [raffleImg, setRaffleImg] = useState("")
    const [raffleName, setRaffleName] = useState("")
    const [viewConfig, setViewConfig] = useState(false)
    const [config, setConfig] = useState({})
    const [pass, setPass] = useState("")
    const [passTwo, setPassTwo] = useState("")
    const [validPassword, setValidPassword] = useState(false)
    function submitNew() {
        fetch("http://localhost:4444/newRaffle",{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                startTime: startTime,
                endTime: endTime,
                entryPrice: entryPrice,
                maxEntryPP: maxPp,
                maxTotal: maxTotal,
                nftRaffle: raffleImg,
                pword: passTwo
            })
        })
        .then(r=>r.json())
        .then(r=> {
            if (r["message"] !== "Success") {
                alert(r.message)
            } else {
                alert("Successfully changed config")
            }
        })
        .catch(e => {
            alert(e)
            
        })
    }
    function changeView() {
        fetch("http://localhost:4444/currentRaffle")
        .then(r=>r.json())
        .then(r => {
            console.log(r)
            setViewConfig(true)
            setConfig(r.raffle)
            
            console.log(config.endTime)
            console.log(config)
            Object.values(r.raffle).map(v => {
                console.log(v)
            })
        })

        
    }

    function access() {
        fetch("http://localhost:4444/verifyAccess", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                access: pass
            })
        })
        .then(r=> r.json())
        .then(r=>{
            if (r["message"] == "Valid") {
                setValidPassword(true)
            } else {
                alert("Invalid password....")
            }
        })
        .catch(e=> {
            console.log(e)
            alert("Invalid password....")
        })
    }
    return (
        <div className={styles.parent}>
        <div className={styles.container}>
        <h1>Admin Panel</h1>
            {validPassword ? (
                null
            ) : (
                <div>
                    <input value={pass} onChange={e => setPass(e.currentTarget.value)}/>
                    <br />
                    <br />
                    <button onClick={access}>Enter</button>
                </div>
            )
            }
            {
                viewConfig && validPassword ? (
                    <div className={styles.conf}>
                        <a href="#" onClick={()=>setViewConfig(false)}>Edit Config</a>
                    <p>Start Time: {config["startTime"] ? config["startTime"]: "Fetching"}</p>
                    <p>End Time: {config["endTime"] ? config["endTime"]: "Fetching"}</p>
                    <p>Max Entries PP: {config["maxEntriesPp"] ? config["maxEntriesPp"]: "Fetching"}</p>
                    <p>Max Total Entries: {config["maxTotalTickets"] ? config["maxTotalTickets"]: "Fetching"}</p>
                    <p>Nft For Raffle: {config["nftRaffle"] ? config["nftRaffle"]: "Fetching"}</p>
                    <p>Raffle Number: {config["raffleNumber"] ? config["raffleNumber"]: "0"}</p>
                    </div>
                ):  [ validPassword &&
                    <>
                    <a href="#" onClick={changeView}>View Config</a>
                    <input type="number" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.currentTarget.value)}></input>
                    <input type="number" placeholder="End Time" value={endTime} onChange={e => setEndTime(e.currentTarget.value)}></input>
                    <input type="number" placeholder="Entry Price" value={entryPrice} onChange={e => setEntryprice(e.currentTarget.value)}></input>
                    <input type="number" placeholder="Max entries per person" value={maxPp} onChange={e => setMaxPp(e.currentTarget.value)}></input>
                    <input type="number" placeholder="Max Total Entries" value={maxTotal} onChange={e => setMaxTotal(e.currentTarget.value)}></input>
                    <input placeholder="Nft Raffle Image" value={raffleImg} onChange={e => setRaffleImg(e.currentTarget.value)}></input>
                    <input placeholder="Nft Raffle Name" value={raffleName} onChange={e => setRaffleName(e.currentTarget.value)}></input>
                    <input onChange={e => setPassTwo(e.currentTarget.value)} placeholder="Password" />

                    <button onClick={submitNew}>Submit</button>
                    </>

                ]
            }

        </div>
        </div>
    )
}

export default AdminPanel;