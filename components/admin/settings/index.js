import styled from "styled-components";
import Link from "next/link";

const Container = styled.div``;
const Banner = styled.div`
  height: 120px;
  background-color: blue;
  width: calc(100% + 40px);
  margin: 0 -20px;

  & h2 {
    margin: 0;
    padding-top: 30px;
    color: white;
  }
`;

const Card = styled.div`
  display: flex;
  width: 90%;
  height: 300px;
  border-radius: 5px;
  margin-top: -30px;
  box-shadow: 1px 1px 2px #333;
  background-color: white;
  margin: -30px auto 0;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: black;
  margin: 0 auto;
`;
const Sidenav = styled.nav`
  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 20px;
  border-right: 1px solid black;

  & p {
    font-size: 1.15rem;
    text-align: center;
    margin: 3px 0;
  }

  & ul {
    margin: 0;
  }
`;

const Details = styled.div`
  padding-left: 20px;
`;

export default function Settings() {
  return (
    <Container>
      <Banner>
        <h2>Account Settings</h2>
      </Banner>
      <Card>
        <Sidenav>
          <>
            <Avatar src="" alt="user" width={80} height={80} />
            <p>John Mwendwa</p>
          </>
          <ul>
            <li>
              <Link href="">Account</Link>
            </li>
            <li>
              <Link href="">Password</Link>
            </li>
          </ul>
        </Sidenav>
        <Details>
          <h2>Account Settings</h2>
        </Details>
      </Card>
    </Container>
  );
}
