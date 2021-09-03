import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import { SocketContext } from "../helpers/SocketContext";

function Home() {
    let history = useHistory();
    const { socket } = useContext(SocketContext);
    const [listOfGames, setListOfGames] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/games")
        .then((response) => {
            setListOfGames(response.data);
        });
    }, [])

    const deleteGame = (game) => {
        const thisTags = game.tags.split(" ").slice(0, -1);
        axios.post("http://localhost:3001/tags/removeTags", thisTags);
        axios.delete(`http://localhost:3001/games/${game.id}`);
    };

    return(
        <div className="Home">
            {(listOfGames.length > 0) &&
                <>
                    <div className="textJoin">
                        JOIN A GAME
                    </div>
                    <div className="gamesBar">
                        {listOfGames.map((value, key) => {
                            const thisTags = value.tags.split(" ").slice(0, -1);
                            return(
                                <div key={key} className="gameDisplay" onClick={ async () => {
                                    await socket.emit("joinRoom", value.title);
                                    socket.on("joined", () => {
                                        deleteGame(value);
                                        history.push({
                                            pathname: `/game/${value.id}`,
                                            state: { isCreator: false }
                                        })
                                    });
                                    socket.on("full", () => {
                                        history.go(0);
                                    });
                                }}>
                                    <header>
                                        {value.title}
                                    </header>
                                    <Grid container style={{ margin: "10px" }} justifyContent="flex-start" alignItems="flex-start">
                                        {thisTags.map((value, key) => {
                                            return(
                                                <Grid item key={key} className="itemTag" style={{ margin: "6px" }}>
                                                    {"#" + value}
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </div>
                            )
                        })}
                    </div>
                    <div className="textOr">
                        OR
                    </div>
                </>
            }
            <Button id="globalButton" style={{ marginTop: 8 }} onClick={() => {history.push({
                pathname: "/creategame",
                state: { user: socket.id }
            })}}>
                Create a Game
            </Button>
        </div>
    )
}

export default Home;