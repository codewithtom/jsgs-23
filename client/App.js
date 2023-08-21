import { useEffect, useState } from "react";
import { Screen, Title } from "./UiComponents";
import { Main } from "./Main";
import { LoginForm } from "./LoginForm";
import { Authenticate, RestoreSession, session } from "./Nakama";

export function App() {
  const logo = new URL('images/logo.png', import.meta.url);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    RestoreSession();
    setIsLoggedIn(!!session);
  }, [])

  const onSubmit = async (username) => {
    await Authenticate(username, username);
    setIsLoggedIn(session !== null);
  };

  return <Screen>
    <img src={logo} width="100%" />
    {isLoggedIn ? <Main setIsLoggedIn={setIsLoggedIn} /> : <LoginForm onSubmit={onSubmit} />}
  </Screen>;
}