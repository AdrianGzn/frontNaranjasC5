import {useNavigate} from "react-router-dom";
import { Button } from "primereact/button";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <main>
            <section>
                <h1>Home</h1>
                <Button label="Log out" onClick={() => navigate("/")} />
            </section>
        </main>
    );
};
