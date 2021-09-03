import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import { SocketContext } from "../helpers/SocketContext";
import MainTagCloud from "../components/MainTagCloud";

function Home() {
    let history = useHistory();
    const { socket } = useContext(SocketContext);
    const [listOfGames, setListOfGames] = useState([]);
    const [filteredListOfGames, setFilteredListOfGames] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);

    useEffect(() => {
        axios.get("https://tic-tac-toe-genis.herokuapp.com/games")
        .then((response) => {
            setListOfGames(response.data);
            setFilteredListOfGames(response.data);
        });

        axios.get("https://tic-tac-toe-genis.herokuapp.com/tags")
        .then((response) => {
            response.data.map((value) => {
                if(value.count > 0){
                    setListOfTags(prevState => [...prevState, { value: value.tagName, count: value.count }]);
                }
                return value;
            });
        });
    }, [])

    const deleteGame = (game) => {
        const thisTags = game.tags.split(" ").slice(0, -1);
        axios.post("https://tic-tac-toe-genis.herokuapp.com/tags/removeTags", thisTags);
        axios.delete(`https://tic-tac-toe-genis.herokuapp.com/games/${game.id}`);
    };

    return(
        <div className="Home">
            {listOfTags.length > 0 && 
                <MainTagCloud data={listOfTags} listOfGames={listOfGames} setFilteredListOfGames={setFilteredListOfGames} />
            }
            {(filteredListOfGames.length > 0) &&
                <>
                    <div className="textJoin">
                        JOIN A GAME
                    </div>
                    <div className="gamesBar">
                        {filteredListOfGames.map((value, key) => {
                            const thisTags = value.tags.split(" ").slice(0, -1);
                            return(
                                <div key={key} className="gameDisplay" onClick={ async () => {
                                    await socket.emit("joinRoom", value.title);
                                    socket.on("joined", () => {
                                        deleteGame(value);
                                        history.push({
                                            pathname: `/game/${value.id}`,
                                            state: { isCreator: false, gameTitle: value.title }
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