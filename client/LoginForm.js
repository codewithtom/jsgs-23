import { useState } from "react";
import { Panel, Container, Title, Form, Button, CenterFlex } from "./UiComponents";

export function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(username);
    setUsername("");
  };

  return <>
      <Panel>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Title>Login</Title>
            <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            <CenterFlex>
              <Button type="submit">Login</Button>
            </CenterFlex>
          </Form>
        </Container>
      </Panel>
    </>;
}