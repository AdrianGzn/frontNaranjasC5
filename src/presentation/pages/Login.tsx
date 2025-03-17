import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
// import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { ApiUserRepository } from "../../features/users/infrastructure/apiUser.repository";
import { LoginUserUseCase } from "../../features/users/application/LoginUserUseCase";
// import { LoginRequest } from "../../features/users/domain/LoginRequest";
import { Toast } from "primereact/toast";
// import LoginController from "../../features/users/infrastructure/controllers/LoginController";

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const userRepository = new ApiUserRepository();
    const loginUseCase = new LoginUserUseCase(userRepository);
    const toast = useRef<Toast>(null);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);

        if (username && password) {
            setLoading(true);
            try {
                const response = await loginUseCase.login({ username, password });
                localStorage.setItem('token', response.token ?? '');
                setLoading(false);
                navigate("/home");
            } catch (error) {
                setLoading(false);
                console.log(error);
                
                if (error === "Unauthorized") {
                    toast.current?.show({severity:'error', summary: 'Error', detail:'Message Content', life: 3000});
                }
                
            }
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
                                    feedback={false}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            loading={loading}
                        />
                    </div>
                </form>
            </section>
        </main>
    );
};
