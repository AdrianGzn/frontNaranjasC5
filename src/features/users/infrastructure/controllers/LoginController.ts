import { useEffect, useState } from "react";
import { IUserRepository } from "../../domain/IUser.repository";
import { ApiUserRepository } from "../apiUser.repository";
import { LoginRequest } from "../../domain/LoginRequest";

export default function LoginController(u: LoginRequest) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: IUserRepository = new ApiUserRepository();
    repository
      .Login(u)
      .then((response) => {
        if (response.success && response.token) {
            setToken(response.token);
            }
        else {
            setError(response.error?.message || 'Unknown error occurred');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, token };
};