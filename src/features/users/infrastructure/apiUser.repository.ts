import { User } from "../domain/user.entity"
import { IUserRepository } from "../domain/IUser.repository"
import { LoginRequest } from "../domain/LoginRequest";
import { LoginResponse } from "../domain/LoginResponse";

export class ApiUserRepository implements IUserRepository {
    private usersURL = `http://localhost:8080/users`;
    private headers = {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
    };

    async Create(user : User): Promise<User> {
        const response = await fetch(`${this.usersURL}/`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: this.headers,
        });
        if (!response.ok) throw new Error("Error al crear el usuario");
        return response.json();
    }
    async Login(login : LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${this.usersURL}/login`, {
            method: "POST",
            body: JSON.stringify(login),
            headers: this.headers,
        });
        if (!response.ok) throw new Error("Error al iniciar sesión");
        return response.json();
    }

    async Update(user : User): Promise<User> {
        const response = await fetch(`${this.usersURL}/${user.id}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: this.headers,
        });
        if (!response.ok) throw new Error("Error al actualizar el usuario");
        return response.json();
    }

    async Delete(id : string): Promise<boolean> {
        const response = await fetch(`${this.usersURL}/${id}`, {
            method: "DELETE",
            headers: this.headers,
        });
        if (!response.ok) throw new Error("Error al eliminar el usuario");
        return true;
    }
  }