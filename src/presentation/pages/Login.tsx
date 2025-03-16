import {useNavigate} from "react-router-dom";
import {useRef} from "react";

export const Login = () => {
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);

    return (
        <>
            <form>
                <input type="text" placeholder="Usuario" ref={username} />
                <input type="password" placeholder="Contraseña" ref={password} />
                <button
                    onClick={() => {
                        navigate("/home");
                    }}
                >
                    Iniciar sesión
                </button>

            </form>
        </>
    );
};
