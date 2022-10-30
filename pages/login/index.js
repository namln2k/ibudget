import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('/api/auth/login', {
      username,
      password
    });
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      alert(responseData.message);
    } else if (responseData.statusCode === 200) {
      router.push("/dashboard/user");
    } else {
      alert('Something went wrong!');
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>
    </>
  );
}
