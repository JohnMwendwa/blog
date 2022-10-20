import Link from "next/link";
import styled from "styled-components";
import Messages from "./Messages";

const Container = styled.div`
  display: flex;
  height: 70vh;
`;
const Sidebar = styled.div`
  background-color: grey;
  width: 150px;
  color: white;

  & li {
    margin: 15px auto;
  }
`;
const Main = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;

  & h2 {
    text-align: center;
  }
`;

export default function Layout() {
  return (
    <Container>
      <Sidebar>
        <nav>
          <ul>
            <li>
              <Link href="/admin/messages">Messages</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
            <li>
              <Link href="/admin/articles">Articles</Link>
            </li>
            <li>
              <Link href="/admin/settings">Settings</Link>
            </li>
            <li>
              <Link href="/admin/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </Sidebar>
      <Main>
        <Messages />
      </Main>
    </Container>
  );
}
