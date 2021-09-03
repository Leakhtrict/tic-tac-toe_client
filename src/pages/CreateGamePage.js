import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import { TextField, Box, Button } from '@material-ui/core';
import CreatableSelect from "react-select/creatable";
import { SocketContext } from "../helpers/SocketContext";

function CreateGamePage() {
    let location = useLocation();
    let history = useHistory();

    const { socket } = useContext(SocketContext);
    const [titleValue, setTitleValue] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/tags")
        .then((response) => {
            const getTags = response.data;
            getTags.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, label: value.tagName }]);
                return value;
            });
        });
    }, []);

    const onTagsChange = (newValue) => {
        setSelectedTags(newValue);
    };

    const onSubmitData = () => {
        if(titleValue.length > 0 && titleValue.length < 16){
            axios.post("http://localhost:3001/tags/addTags", selectedTags);
            let tagsString = "";
            selectedTags.map((value) => {
                tagsString += value.label + " ";
                return value;
            });
            const data = {
                title: titleValue,
                tags: tagsString,
                createdBy: location.state.user,
            }

            axios.post("http://localhost:3001/games/createGame", data)
            .then((response) => {
                socket.emit("joinRoom", response.data.title);
                history.push({
                    pathname: `/game/${response.data.id}`,
                    state: { isCreator: true, gameTitle: response.data.title }
                });
            });
        } else{
            setTitleError(true);
        }
    };

    return(
        <div className="CreateGamePage">
            <Box>
                <TextField
                    required
                    id="inputTitle"
                    label="Title(max. 15 chars)"
                    value={titleValue}
                    onChange={(e) => {
                        if(titleError){
                            setTitleError(false);
                        }
                        setTitleValue(e.target.value);
                    }}
                    error={titleError}
                />
                <CreatableSelect 
                    isMulti
                    id="inputTags"
                    onChange={onTagsChange}
                    onInputChange={(e) => {
                        return e.replace(" ", '');
                    }}
                    options={listOfTags}
                    placeholder="Create New or Select Existing tags"
                />

                <Button id="globalButton" onClick={onSubmitData}> Confirm</Button>
            </Box>
        </div>
    )
}

export default CreateGamePage;