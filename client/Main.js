import { useEffect, useState } from "react";
import { Avatar, Button, Panel, SmallText, Flex } from "./UiComponents";
import { FriendsPanel } from "./FriendsPanel";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { session, GetAccount, Logout } from "./Nakama";

export function Main({ setIsLoggedIn}) {
  const [coins, setCoins] = useState(0);
  const [showFriendsPanel, setShowFriendsPanel] = useState(true);
  const [showLeaderboardPanel, setShowLeaderboardPanel] = useState(false);

  useEffect(() => {
    handleRefreshAccount();
  }, []);

  const handleRefreshAccount = async () => {
    const account = await GetAccount();
    if (!account) {
      setCoins(0);
      return;
    }

    const wallet = JSON.parse(account.wallet);
    if (wallet && wallet["coins"]) {
      setCoins(wallet["coins"]);
    } else {
      setCoins(0);
    }
  };

  const handleLogout = async () => {
    await Logout();
    setIsLoggedIn(false);
  };

  const handleShowFriends = () => {
    setShowFriendsPanel(true);
    setShowLeaderboardPanel(false);
  };

  const handleShowLeaderboard = () => {
    setShowFriendsPanel(false);
    setShowLeaderboardPanel(true);
  };

  return <>
    <Flex style={{margin: "10px 0"}}>
      <Avatar identity={session.user_id} $small={true} />
      <SmallText>Hi, {session.username}. 🪙 {coins}</SmallText>
    </Flex>
    <div>
      <Button onClick={handleShowFriends}>Friends</Button>
      <Button onClick={handleShowLeaderboard}>Leaderboard</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
    <FriendsPanel hidden={!showFriendsPanel} />
    <LeaderboardPanel hidden={!showLeaderboardPanel} refreshAccount={handleRefreshAccount} />
  </>;
}