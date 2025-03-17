import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleLogin = (e : any) => {
        e.preventDefault();
        setSubmitted(true);

        if (username && password) {
            navigate("/home");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <section className="flex flex-col items-center justify-center p-4 shadow-lg rounded-xl bg-white" style={{ width: '350px' }}>
                <h1 className="text-3xl font-bold mb-5">Login</h1>
                <form onSubmit={handleLogin} className="w-full">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <span className="p-float-label mb-1">
                                <InputText
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={submitted && !username ? 'p-invalid w-full' : 'w-full'}
                                />
                                <label htmlFor="username">Username</label>
                            </span>
                            {submitted && !username && (
                                <small className="p-error flex items-center gap-1">
                                    <i className="pi pi-exclamation-circle"></i>
                                    Username is required
                                </small>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="p-float-label mb-1">
                                <Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    toggleMask
                                    feedback={false}
                                    className={submitted && !password ? 'p-invalid w-full' : 'w-full'}
                                />
                                <label htmlFor="password">Password</label>
                            </span>
                            {submitted && !password && (
                                <small className="p-error flex items-center gap-1">
                                    <i className="pi pi-exclamation-circle"></i>
                                    Password is required
                                </small>
                            )}
                        </div>

                        <Button
                            type="submit"
                            label="Login"
                            className="mt-3"
                        />
                    </div>
                </form>
            </section>
        </main>
    );
};
