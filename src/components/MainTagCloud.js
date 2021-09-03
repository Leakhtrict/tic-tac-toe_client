import { TagCloud } from 'react-tagcloud';
import { Container, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from 'react';

export default function MainTagCloud({data, listOfGames, setFilteredListOfGames}) {
    const [filters, setFilters] = useState([]);

    const filterList = (tagFilter) => {
        setFilters(prevState => [...prevState, tagFilter]);
        setFilteredListOfGames(prevState => [...prevState].filter((value) => {
            return value.tags.toLowerCase().includes(tagFilter.toLowerCase() + " ")
        }));
    };

    const clearFilters = () => {
        setFilters([]);
        setFilteredListOfGames(listOfGames);
    };

    return (
        <Container maxWidth="xs" style={{ margin: "8px 0px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TagCloud
                tags={data}
                disableRandomColor={true}
                randomNumberGenerator={() => {return 0}}
                onClick={(tag) => {
                    filterList(tag.value);
                }}
                renderer={(tag) => {
                    if(filters.length === 0){
                        return(
                            <div key={tag.value} className="tagDefault" style={{ margin: "6px", display: "inline-block" }}>{"#" + tag.value}</div>
                        )
                    } else{
                        if(filters.includes(tag.value)){
                            return(
                                <div key={tag.value} className="tagClicked" style={{ margin: "6px", display: "inline-block" }}>{"#" + tag.value}</div>
                            )
                        } else{
                            return(
                                <div key={tag.value} className="tagUnclicked" style={{ margin: "6px", display: "inline-block" }}>{"#" + tag.value}</div>
                            )
                        }
                    }
                }}
            />
            <IconButton onClick={clearFilters}>
                <DeleteIcon />
            </IconButton>
        </Container>
    );
}
