import { useState } from "react";
import { IUserRepository } from "../../domain/IUser.repository";
import { ApiUserRepository } from "../apiUser.repository";
import { User } from "../../domain/user.entity";
import { GetAllUsersUseCase } from "../../application/GetAllUsersUseCase";

export default function useGetUsers() {
  const [usersResult, setUsersResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultUsers = async () => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: IUserRepository = new ApiUserRepository();
          const getUsersUseCase = new GetAllUsersUseCase(repository);
          const resultUsers = await getUsersUseCase.execute();
          setUsersResult(resultUsers);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { usersResult, loading, error, consultUsers };
};