import { Client, Session } from "@heroiclabs/nakama-js";
const client = new Client('defaultkey', '127.0.0.1', 7350);

let session = null;

let sessionToken = localStorage.getItem('session_token');
let refreshToken = localStorage.getItem('refresh_token');

async function Authenticate(id, username) {
    session = await client.authenticateCustom(id, true, username);
    localStorage.setItem('session_token', session.token);
    localStorage.setItem('refresh_token', session.refresh_token);
}

function RestoreSession() {
    sessionToken = localStorage.getItem('session_token');
    refreshToken = localStorage.getItem('refresh_token');
    
    if (sessionToken && refreshToken) {
        session = Session.restore(sessionToken, refreshToken);
    }
}

function Logout() {
    client.sessionLogout(session, sessionToken, refreshToken);
    session = null;
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
}

async function GetAccount() {
    const result = await client.getAccount(session);
    return result;
}

async function GetFriends(limit = 100) {
    const result = await client.listFriends(session, null, limit);

    if (result) {
        return result.friends.filter(friend => friend.state !== 3);
    }

    return null;
}

async function AddFriend(username) {
    const result = await client.addFriends(session, null, [username]);
    return result;
}

async function GetGlobalLeaderboard() {
    const result = await client.listLeaderboardRecords(session, 'weekly_leaderboard', null, 100);
    return result.records;
}

async function GetFriendLeaderboard() {
    const friends = await GetFriends();
    if (!friends) {
        return null;
    }

    const friendIds = friends.map(friend => friend.user.id);
    friendIds.push(session.user_id);

    const result = await client.listLeaderboardRecords(session, 'weekly_leaderboard', friendIds, 100);
    return result.owner_records;
}

async function SubmitLeaderboardScore(score = 0) {
    await client.writeLeaderboardRecord(session, 'weekly_leaderboard', { score });
}

export { 
    session,
    RestoreSession,
    Authenticate,
    Logout,
    GetAccount,
    GetFriends, 
    AddFriend, 
    GetGlobalLeaderboard,
    GetFriendLeaderboard,
    SubmitLeaderboardScore
}