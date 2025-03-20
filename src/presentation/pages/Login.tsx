import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
// import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { ApiUserRepository } from "../../features/users/infrastructure/apiUser.repository";
import { LoginUserUseCase } from "../../features/users/application/LoginUserUseCase";
import { CreateUserUseCase } from "../../features/users/application/CreateUserUseCase";
// import { LoginRequest } from "../../features/users/domain/LoginRequest";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { User } from "../../features/users/domain/user.entity";
import { Dropdown } from "primereact/dropdown";

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const userRepository = new ApiUserRepository();
    const loginUseCase = new LoginUserUseCase(userRepository);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const toast = useRef<Toast>(null);
    const [visible, setVisible] = useState(false);

    const [registerSubmitted, setRegisterSubmitted] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerName, setRegisterName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRol, setRegisterRol] = useState('');

    const roles = [
        { label: 'Encargado', value: 'encargado' },
        { label: 'Recolector', value: 'recolector' }
    ];

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
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `${error}` });
            }
        }
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setRegisterSubmitted(true);

        if (registerName && registerUsername && registerPassword && registerRol) {
            setRegisterLoading(true);
            try {
                const newUser: User = {
                    id: 0, // El ID se asignará en el servidor
                    name: registerName,
                    username: registerUsername,
                    password: registerPassword,
                    rol: registerRol
                };

                await createUserUseCase.execute(newUser);
                setRegisterLoading(false);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado correctamente' });
                setVisible(false);

                setRegisterName('');
                setRegisterUsername('');
                setRegisterPassword('');
                setRegisterRol('');
                setRegisterSubmitted(false);
                setUsername(registerUsername);
                setPassword(registerPassword);
            } catch (error) {
                setRegisterLoading(false);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `${error}` });
            }
        }
    };

    const registerFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Registrar" icon="pi pi-check" onClick={handleRegister} loading={registerLoading} />
        </div>
    );

    return (
        <main className="flex flex-col items-center justify-center h-screen bg-[#f3f4f6]">
            <Toast ref={toast} />
            <div className="mb-5">
                <h1 className="text-4xl font-bold text-amber-900 text-center">
                    Sistema de Naranjas
                </h1>
                <p className="text-amber-700 text-center">La mejor gestión para tu negocio</p>
            </div>

            <section className="flex flex-col items-center justify-center p-6 shadow-lg rounded-xl bg-white border border-amber-200" style={{ width: '380px' }}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 w-full text-center">Iniciar Sesión</h2>

                <form onSubmit={handleLogin} className="w-full">
                    <div className="flex flex-col gap-4">
                        <div className="mb-3">
                            <label htmlFor="username" className="block text-sm text-amber-700 mb-1">Nombre de Usuario</label>
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={submitted && !username ? 'p-invalid w-full' : 'w-full'}
                            />
                            {submitted && !username && (
                                <small className="p-error flex items-center gap-1 mt-1">
                                    <i className="pi pi-exclamation-circle"></i>
                                    El nombre de usuario es requerido
                                </small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="block text-sm text-amber-700 mb-1">Contraseña</label>
                            <Password
                                id="password"
                                value={password}
                                feedback={false}
                                onChange={(e) => setPassword(e.target.value)}
                                className={submitted && !password ? 'p-invalid w-full' : 'w-full'}
                                toggleMask
                                inputClassName="w-full"
                            />
                            {submitted && !password && (
                                <small className="p-error flex items-center gap-1 mt-1">
                                    <i className="pi pi-exclamation-circle"></i>
                                    La contraseña es requerida
                                </small>
                            )}
                        </div>

                        <Button
                            type="submit"
                            label="Iniciar Sesión"
                            icon="pi pi-sign-in"
                            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600"
                            loading={loading}
                        />

                        <div className="flex justify-center mt-3">
                            <div className="text-amber-600 hover:text-amber-800 cursor-pointer flex items-center gap-4" onClick={() => setVisible(true)}>
                                <p>Registrarse</p>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <div className="mt-4 text-amber-800 text-sm">
                &copy; 2023 Sistema de Naranjas - Todos los derechos reservados
            </div>

            <Dialog
                header="Registro de Usuario"
                visible={visible}
                style={{ width: '500px' }}
                footer={registerFooter}
                onHide={() => setVisible(false)}
                modal
                className="p-fluid"
            >
                <div className="flex flex-col gap-6 mt-6">
                    <div className="flex flex-col">
                        <span className="p-float-label mb-1">
                            <InputText
                                id="register-name"
                                value={registerName}
                                onChange={(e) => setRegisterName(e.target.value)}
                                className={registerSubmitted && !registerName ? 'p-invalid w-full' : 'w-full'}
                            />
                            <label htmlFor="register-name">Nombre Completo</label>
                        </span>
                        {registerSubmitted && !registerName && (
                            <small className="p-error flex items-center gap-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El nombre es requerido
                            </small>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="p-float-label mb-1">
                            <InputText
                                id="register-username"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                className={registerSubmitted && !registerUsername ? 'p-invalid w-full' : 'w-full'}
                            />
                            <label htmlFor="register-username">Nombre de Usuario</label>
                        </span>
                        {registerSubmitted && !registerUsername && (
                            <small className="p-error flex items-center gap-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El nombre de usuario es requerido
                            </small>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="p-float-label mb-1">
                            <Password
                                id="register-password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                feedback={true}
                                className={registerSubmitted && !registerPassword ? 'p-invalid w-full' : 'w-full'}
                                toggleMask
                            />
                            <label htmlFor="register-password">Contraseña</label>
                        </span>
                        {registerSubmitted && !registerPassword && (
                            <small className="p-error flex items-center gap-1">
                                <i className="pi pi-exclamation-circle"></i>
                                La contraseña es requerida
                            </small>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="p-float-label mb-1">
                            <Dropdown
                                id="register-rol"
                                value={registerRol}
                                options={roles}
                                onChange={(e) => setRegisterRol(e.value)}
                                className={registerSubmitted && !registerRol ? 'p-invalid w-full' : 'w-full'}
                            />
                            <label htmlFor="register-rol">Rol</label>
                        </span>
                        {registerSubmitted && !registerRol && (
                            <small className="p-error flex items-center gap-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El rol es requerido
                            </small>
                        )}
                    </div>
                </div>
            </Dialog>
        </main>
    );
};
