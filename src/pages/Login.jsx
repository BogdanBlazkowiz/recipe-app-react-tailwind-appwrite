import { useState } from "react";
import { useUser } from "../lib/context/user";

export function Login() {
    const user = useUser();

    const [email, setEmail] = useState("tester@testing.com");
    const [password, setPassword] = useState("password123456");

    return (
        <section>
            <h1>Login or register</h1>
            <form className="flex flex-col gap-2">
                <input
                className="rounded-xl p-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <input
                className="rounded-xl p-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <div className="flex gap-2">
                    <button
                        className="button rounded-xl border border-solid border-black p-2 hover:opacity-70"
                        type="button"
                        onClick={() => user.login(email, password)}
                    >
                        Login
                    </button>
                    <button
                        className="button rounded-xl border border-solid border-black p-2 hover:opacity-70"
                        type="button"
                        onClick={() => user.register(email, password)}
                    >
                        Register
                    </button>
                </div>
            </form>
        </section>
    );
}
