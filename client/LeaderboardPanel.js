import { useState, useEffect } from "react";
import { Form, Panel, Button, ToggleButton, CenterFlex, ListRow, Avatar, ScrollRect, Container, Subtitle, ToggleButton } from "./UiComponents";
import { session, GetGlobalLeaderboard, GetFriendLeaderboard, SubmitLeaderboardScore } from "./Nakama";

export function LeaderboardPanel({hidden, refreshAccount}) {
    const [selectedLeaderboard, setSelectedLeaderboard] = useState(1);
    const [globalRecords, setGlobalRecords] = useState();
    const [friendRecords, setFriendRecords] = useState();
    const [score, setScore] = useState("");
    
    useEffect(() => {
        getLeaderboard();
    }, []);

    const getLeaderboard = async () => {
        const globalResults = await GetGlobalLeaderboard();
        if (globalResults) {
            setGlobalRecords(globalResults);
        }

        const friendResults = await GetFriendLeaderboard();
        if (friendResults) {
            setFriendRecords(friendResults);
        }

        refreshAccount();
    };

    const handleSubmitScore = async e => {
        e.preventDefault();

        if (isNaN(score)) {
            console.log("Not a number");
            return;
        }

        await SubmitLeaderboardScore(score);
        await getLeaderboard();
        setScore("");
    };

    const handleSwitchLeaderboard = index => {
        setSelectedLeaderboard(index);
    };

    return <Panel hidden={hidden}>
        <Container>
            <CenterFlex>
                <ToggleButton onClick={e => handleSwitchLeaderboard(1)} className={selectedLeaderboard === 1 ? "active" : ""}>Global</ToggleButton>
                <ToggleButton onClick={e => handleSwitchLeaderboard(2)} className={selectedLeaderboard === 2 ? "active" : ""}>Friends</ToggleButton>
            </CenterFlex>

            {selectedLeaderboard === 1 &&
                <>
                    <Subtitle>Global Leaderboard</Subtitle>
                    <ScrollRect $scrollHeight="300px">
                    {globalRecords && globalRecords.map((record, index) => (
                        <div key={`global_${index}`}>
                            <ListRow $highlight={record.owner_id === session.user_id}>
                                <Avatar identity={record.owner_id} />
                                <h3>#{index+1} {record.username} ({record.score} points)</h3>
                            </ListRow>
                        </div>
                    ))}
                    </ScrollRect>
                </>
            }

            {selectedLeaderboard === 2 &&
                <>
                    <Subtitle>Friends Leaderboard</Subtitle>
                    <ScrollRect $scrollHeight="300px">
                    {friendRecords && friendRecords.map((record, index) => (
                        <div key={`friends_${index}`}>
                            <ListRow $highlight={record.owner_id === session.user_id}>
                                <Avatar identity={record.owner_id} />
                                <h3>#{index+1} {record.username} ({record.score} points)</h3>
                            </ListRow>
                        </div>
                    ))}
                    </ScrollRect>
                </>
            }

            <Subtitle>Submit Score</Subtitle>
            <Form onSubmit={handleSubmitScore}>
                <input type="text" placeholder="Score" value={score} onChange={e => setScore(e.target.value)} />
                <CenterFlex>
                    <Button>Submit</Button>
                </CenterFlex>
            </Form>
        </Container>
    </Panel>
}