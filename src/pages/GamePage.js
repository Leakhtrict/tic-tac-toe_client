import React, { useState, useContext, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { Button } from '@material-ui/core';
import { SocketContext } from "../helpers/SocketContext";

function GamePage() {
    let location = useLocation();
    let history = useHistory();
    let { id } = useParams();

    const { socket } = useContext(SocketContext);
    const [onTurn, setOnTurn] = useState(location.state.isCreator);
    const [gameStarted, setGameStarted] = useState(false);
    const thisSymbol = location.state.isCreator ? "X" : "O";
    const [matrix, setMatrix] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);
    
    socket.off("emitSendTurn").on("emitSendTurn", async (data) => {
        setMatrix(prevState => {
            const tempMatrix = [...prevState];
            tempMatrix[data.row][data.column] = location.state.isCreator ? "O" : "X";
            return tempMatrix;
        });
        if(data.result){
            alert(data.result);
            await socket.emit("leaveRoom", location.state.gameTitle);
            history.push("/");
        } else{
            setOnTurn(true);
        }
    });

    socket.off("emitStartGame").on("emitStartGame", (data) => {
        if(id === data){
            setGameStarted(true);
        }
    });

    useEffect(() => {
        if(!location.state.isCreator){
            socket.emit("startGame", id);
            setGameStarted(true);
        }
    }, []);

    const changeCell = async (row, column) => {
        const data = { 
            row: row,
            column: column,
            id: id,
        };
        let result = "";
        setMatrix(prevState => {
            const tempMatrix = [...prevState];
            tempMatrix[row][column] = thisSymbol;

            if(tempMatrix[1][1]){
                if(tempMatrix[0][0] === tempMatrix[1][1] && tempMatrix[2][2] === tempMatrix[1][1]){
                    if(tempMatrix[1][1] === thisSymbol){
                        data.result = "You lost :(";
                        result = "You won!";
                    } else{
                        data.result = "You won!";
                        result = "You lost :(";
                    }
                }

                if(tempMatrix[2][0] === tempMatrix[1][1] && tempMatrix[0][2] === tempMatrix[1][1]){
                    if(tempMatrix[1][1] === thisSymbol){
                        data.result = "You lost :(";
                        result = "You won!";
                    } else{
                        data.result = "You won!";
                        result = "You lost :(";
                    }
                }
            }

            for(let i = 0; i < 3; i++){
                if(tempMatrix[i][1]){
                    if(tempMatrix[i][0] === tempMatrix[i][1] && tempMatrix[i][2] === tempMatrix[i][1]){
                        if(tempMatrix[i][1] === thisSymbol){
                            data.result = "You lost :(";
                            result = "You won!";
                        } else{
                            data.result = "You won!";
                            result = "You lost :(";
                        }
                    }
                }

                if(tempMatrix[1][i]){
                    if(tempMatrix[0][i] === tempMatrix[1][i] && tempMatrix[2][i] === tempMatrix[1][i]){
                        if(tempMatrix[1][i] === thisSymbol){
                            data.result = "You lost :(";
                            result = "You won!";
                        } else{
                            data.result = "You won!";
                            result = "You lost :(";
                        }
                    }
                }
            }

            if(result === ""){
                if (matrix.every((r) => r.every((c) => c !== null))) {
                    data.result = "It's a tie!";
                    result = "It's a tie!";
                }
            }

            return tempMatrix;
        });
        setOnTurn(false);
        await socket.emit("sendTurn", data);
        if(result.length > 0){
            alert(result);
            await socket.emit("leaveRoom", location.state.gameTitle);
            history.push("/");
        }
    };

    return(
        <div className="GamePage">
            {!gameStarted ?
                <div> Waiting for an opponent...</div> :
                onTurn ? 
                <div> Your turn</div> :
                <div> Opponent's turn</div>
            }
            <table className="tic-tac-toe-table">
                {matrix.map((value, keyRow) => {
                    return(
                        <tr>
                            {value.map((val, keyColumn) => {
                                return(
                                    <td id="matrixCell">
                                        {(onTurn && (val == null) && gameStarted) ?
                                            <Button id="matrixCellButton" onClick={() => changeCell(keyRow, keyColumn)}>
                                                {val}
                                            </Button> :
                                            <Button id="matrixCellButton" disabled>
                                                {val}
                                            </Button>
                                        }
                                        
                                    </td>
                                )
                            })}
                        </tr>
                    )
                    
                })}
            </table>
        </div>
    )
}

export default GamePage;