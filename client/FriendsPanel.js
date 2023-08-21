import { useState, useEffect } from "react";
import { Form, Panel, Button, CenterFlex, ListRow, Avatar, ScrollRect, Container, Subtitle } from "./UiComponents";
import { GetFriends, AddFriend } from "./Nakama";

export function FriendsPanel({hidden}) {
    const [friendsList, setFriendsList] = useState();
    const [addFriendUsername, setAddFriendUsername] = useState("");
    
    useEffect(() => {
        getFriends();
    }, []);

    const getFriends = async () => {
        const friends = await GetFriends();
        if (friends) {
            setFriendsList(friends);
        }
    };

    const handleAddFriend = async e => {
        e.preventDefault();
        await AddFriend(addFriendUsername);
        setAddFriendUsername("");
        await getFriends();
    };

    return <Panel hidden={hidden}>
        <Container>
            <Subtitle>Friends: {friendsList ? friendsList.length : 0}</Subtitle>
            <ScrollRect $scrollHeight="300px">
            {friendsList && friendsList.map((friend, index) => (
                <ListRow key={index}>
                    <Avatar identity={friend.user.id} />
                    <h3>
                        {friend.user.username}
                        <i>{friend.state === 1 && " (Sent)"}</i>
                        <i>{friend.state === 2 && " (Received)"}</i>
                    </h3>
                </ListRow>
            ))}
            </ScrollRect>

            <Subtitle>Add Friend</Subtitle>
            <Form onSubmit={handleAddFriend}>
                <input type="text" placeholder="Username" value={addFriendUsername} onChange={e => setAddFriendUsername(e.target.value)} />
                <CenterFlex>
                    <Button>Add</Button>
                </CenterFlex>
            </Form>
        </Container>
    </Panel>
}