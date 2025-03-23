import { User } from "../../features/users/domain/user.entity";

interface StoredUser {
    name: string;
    rol: string;
    username: string;
}

export class AuthService {
  static saveUserData(token: string, user: StoredUser): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUserData(): StoredUser | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as StoredUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static hasRole(role: string | string[]): boolean {
    const user = this.getUserData();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.rol);
    }
    
    return user.rol === role;
  }

  static isOwner(): boolean {
    return this.hasRole('dueño');
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}