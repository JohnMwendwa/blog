import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  margin-bottom: 30px;

  & h2 {
    font-size: 2.5rem;
    font-family: jokerman;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  & > div {
    color: red;
    margin-top: -10px;
    padding: 5px 5px;
  }

  & a {
    font-weight: 900;
    color: ${(c) => c.theme.colors.ui.secondary};
  }
`;
const Form = styled.form`
  max-width: 400px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  outline: 1px solid ${(c) => c.theme.colors.ui.secondary};
  margin: 5px 0;
  text-align: center;
`;
const Btn = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin: 10px 0;
  font-size: 1.2rem;
  background-color: ${(c) => c.theme.colors.ui.secondary};
  color: white;
  margin-bottom: 0;
  cursor: pointer;
`;

async function createUser(
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong!");
  }
  return data;
}

export default function Signup() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [error, setError] = useState();

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace("/admin/dashboard");
    }
  }, [router, session]);

  useEffect(() => {
    let timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("A name should have more than two characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const result = await createUser(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );

      await signIn("credentials", {
        email,
        password,
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <FormWrapper>
      <h2>Signup</h2>
      {error && <div>{error}</div>}

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First name"
          required
          ref={firstNameRef}
        />
        <Input type="text" placeholder="Last name" required ref={lastNameRef} />
        <Input type="email" placeholder="Email" required ref={emailRef} />
        <Input
          type="password"
          placeholder="Enter password"
          required
          ref={passwordRef}
        />
        <Input
          type="password"
          placeholder="Confirm password"
          required
          ref={confirmPasswordRef}
        />
        <Btn>Signup</Btn>
      </Form>
      <p>
        Already have an account? <Link href="/admin/login">Login</Link>
      </p>
    </FormWrapper>
  );
}
