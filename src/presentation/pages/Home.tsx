import {useNavigate} from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <main>
            <section>
                <h1>Home</h1>
                <button onClick={() => navigate("/")}>Log out</button>
                
            </section>
        </main>
    );
};
