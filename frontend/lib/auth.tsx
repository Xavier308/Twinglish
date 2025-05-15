// frontend/lib/auth.tsx
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Define user type
interface User {
  id: number;
  username: string;
  email: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// The Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    console.log('AuthProvider mounted');
    
    // Function to load user
    const loadUser = () => {
      try {
        // Check if we're in the browser
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        // Try to get the token from localStorage
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage:', token ? 'exists' : 'not found');
        
        // If no token, user is not logged in
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // For demo purposes, create a mock user if token exists
        // In production, you'd verify this token with your backend
        const userData = {
          id: 1,
          username: "testuser",
          email: "test@example.com",
        };
        
        // Set the user
        setUser(userData);
        console.log('User loaded from token:', userData);
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear token and user on error
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Call the load function
    loadUser();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      console.log(`Login attempt: username=${username}, password=${password.length} chars`);
      
      // For demo purposes, accept any login with username "testuser" and password "Password123"
      if (username === "testuser" && password === "Password123") {
        // Create a simple token
        const token = "testuser:1:" + Date.now();
        
        // Store the token
        localStorage.setItem('authToken', token);
        
        // Create user object
        const userData = {
          id: 1,
          username,
          email: `${username}@example.com`,
        };
        
        // Set user and redirect
        setUser(userData);
        console.log('User set, redirecting to home');
        
        // Use a short delay for state to update
        setTimeout(() => {
          router.push('/');
        }, 100);
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  // Register function (simplified)
  const register = async (username: string, email: string, password: string) => {
    try {
      console.log(`Registration attempt: username=${username}, email=${email}`);
      
      // For demo purposes, just login after registration
      await login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Return the provider with all values
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth
export const useAuth = () => useContext(AuthContext);