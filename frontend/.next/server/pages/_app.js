/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./lib/auth.tsx":
/*!**********************!*\
  !*** ./lib/auth.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n// frontend/lib/auth.tsx\n\n\n\n// Create the context with default values\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    user: null,\n    loading: true,\n    login: async ()=>{},\n    logout: ()=>{},\n    register: async ()=>{}\n});\n// The Auth Provider component\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    // Load user on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"AuthProvider.useEffect\": ()=>{\n            console.log('AuthProvider mounted');\n            // Function to load user\n            const loadUser = {\n                \"AuthProvider.useEffect.loadUser\": ()=>{\n                    try {\n                        // Check if we're in the browser\n                        if (true) {\n                            setLoading(false);\n                            return;\n                        }\n                        // Try to get the token from localStorage\n                        const token = localStorage.getItem('authToken');\n                        console.log('Token from localStorage:', token ? 'exists' : 'not found');\n                        // If no token, user is not logged in\n                        if (!token) {\n                            setUser(null);\n                            setLoading(false);\n                            return;\n                        }\n                        // For demo purposes, create a mock user if token exists\n                        // In production, you'd verify this token with your backend\n                        const userData = {\n                            id: 1,\n                            username: \"testuser\",\n                            email: \"test@example.com\"\n                        };\n                        // Set the user\n                        setUser(userData);\n                        console.log('User loaded from token:', userData);\n                    } catch (error) {\n                        console.error('Error loading user:', error);\n                        // Clear token and user on error\n                        localStorage.removeItem('authToken');\n                        setUser(null);\n                    } finally{\n                        setLoading(false);\n                    }\n                }\n            }[\"AuthProvider.useEffect.loadUser\"];\n            // Call the load function\n            loadUser();\n        }\n    }[\"AuthProvider.useEffect\"], []);\n    // Login function\n    const login = async (username, password)=>{\n        try {\n            console.log(`Login attempt: username=${username}, password=${password.length} chars`);\n            // For demo purposes, accept any login with username \"testuser\" and password \"Password123\"\n            if (username === \"testuser\" && password === \"Password123\") {\n                // Create a simple token\n                const token = \"testuser:1:\" + Date.now();\n                // Store the token\n                localStorage.setItem('authToken', token);\n                // Create user object\n                const userData = {\n                    id: 1,\n                    username,\n                    email: `${username}@example.com`\n                };\n                // Set user and redirect\n                setUser(userData);\n                console.log('User set, redirecting to home');\n                // Use a short delay for state to update\n                setTimeout(()=>{\n                    router.push('/');\n                }, 100);\n            } else {\n                throw new Error(\"Invalid username or password\");\n            }\n        } catch (error) {\n            console.error('Login error:', error);\n            throw error;\n        }\n    };\n    // Logout function\n    const logout = ()=>{\n        console.log('Logging out');\n        localStorage.removeItem('authToken');\n        setUser(null);\n        router.push('/login');\n    };\n    // Register function (simplified)\n    const register = async (username, email, password)=>{\n        try {\n            console.log(`Registration attempt: username=${username}, email=${email}`);\n            // For demo purposes, just login after registration\n            await login(username, password);\n        } catch (error) {\n            console.error('Registration error:', error);\n            throw error;\n        }\n    };\n    // Return the provider with all values\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            loading,\n            login,\n            logout,\n            register\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/xavierdev/coding_projects/twinglish/frontend/lib/auth.tsx\",\n        lineNumber: 145,\n        columnNumber: 5\n    }, undefined);\n};\n// Hook to use auth\nconst useAuth = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0ZaLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLCtCQUErQixFQUFFTyxTQUFTLFFBQVEsRUFBRUMsT0FBTztZQUV4RSxtREFBbUQ7WUFDbkQsTUFBTWpCLE1BQU1nQixVQUFVSTtRQUN4QixFQUFFLE9BQU9GLE9BQU87WUFDZFYsUUFBUVUsS0FBSyxDQUFDLHVCQUF1QkE7WUFDckMsTUFBTUE7UUFDUjtJQUNGO0lBRUEsc0NBQXNDO0lBQ3RDLHFCQUNFLDhEQUFDckIsWUFBWStCLFFBQVE7UUFBQ0MsT0FBTztZQUFFL0I7WUFBTUM7WUFBU0M7WUFBT0M7WUFBUUM7UUFBUztrQkFDbkVFOzs7Ozs7QUFHUCxFQUFFO0FBRUYsbUJBQW1CO0FBQ1osTUFBTTBCLFVBQVUsSUFBTW5DLGlEQUFVQSxDQUFDRSxhQUFhIiwic291cmNlcyI6WyIvaG9tZS94YXZpZXJkZXYvY29kaW5nX3Byb2plY3RzL3R3aW5nbGlzaC9mcm9udGVuZC9saWIvYXV0aC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZnJvbnRlbmQvbGliL2F1dGgudHN4XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5cbi8vIERlZmluZSB1c2VyIHR5cGVcbmludGVyZmFjZSBVc2VyIHtcbiAgaWQ6IG51bWJlcjtcbiAgdXNlcm5hbWU6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbn1cblxuLy8gRGVmaW5lIGNvbnRleHQgdHlwZVxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XG4gIHVzZXI6IFVzZXIgfCBudWxsO1xuICBsb2FkaW5nOiBib29sZWFuO1xuICBsb2dpbjogKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIGxvZ291dDogKCkgPT4gdm9pZDtcbiAgcmVnaXN0ZXI6ICh1c2VybmFtZTogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG4vLyBDcmVhdGUgdGhlIGNvbnRleHQgd2l0aCBkZWZhdWx0IHZhbHVlc1xuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZT4oe1xuICB1c2VyOiBudWxsLFxuICBsb2FkaW5nOiB0cnVlLFxuICBsb2dpbjogYXN5bmMgKCkgPT4ge30sXG4gIGxvZ291dDogKCkgPT4ge30sXG4gIHJlZ2lzdGVyOiBhc3luYyAoKSA9PiB7fSxcbn0pO1xuXG4vLyBUaGUgQXV0aCBQcm92aWRlciBjb21wb25lbnRcbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdE5vZGUgfSkgPT4ge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcblxuICAvLyBMb2FkIHVzZXIgb24gbW91bnRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnQXV0aFByb3ZpZGVyIG1vdW50ZWQnKTtcbiAgICBcbiAgICAvLyBGdW5jdGlvbiB0byBsb2FkIHVzZXJcbiAgICBjb25zdCBsb2FkVXNlciA9ICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHdlJ3JlIGluIHRoZSBicm93c2VyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gVHJ5IHRvIGdldCB0aGUgdG9rZW4gZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICAgICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFRva2VuJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUb2tlbiBmcm9tIGxvY2FsU3RvcmFnZTonLCB0b2tlbiA/ICdleGlzdHMnIDogJ25vdCBmb3VuZCcpO1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgbm8gdG9rZW4sIHVzZXIgaXMgbm90IGxvZ2dlZCBpblxuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgc2V0VXNlcihudWxsKTtcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEZvciBkZW1vIHB1cnBvc2VzLCBjcmVhdGUgYSBtb2NrIHVzZXIgaWYgdG9rZW4gZXhpc3RzXG4gICAgICAgIC8vIEluIHByb2R1Y3Rpb24sIHlvdSdkIHZlcmlmeSB0aGlzIHRva2VuIHdpdGggeW91ciBiYWNrZW5kXG4gICAgICAgIGNvbnN0IHVzZXJEYXRhID0ge1xuICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgIHVzZXJuYW1lOiBcInRlc3R1c2VyXCIsXG4gICAgICAgICAgZW1haWw6IFwidGVzdEBleGFtcGxlLmNvbVwiLFxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gU2V0IHRoZSB1c2VyXG4gICAgICAgIHNldFVzZXIodXNlckRhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZygnVXNlciBsb2FkZWQgZnJvbSB0b2tlbjonLCB1c2VyRGF0YSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIHVzZXI6JywgZXJyb3IpO1xuICAgICAgICAvLyBDbGVhciB0b2tlbiBhbmQgdXNlciBvbiBlcnJvclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aFRva2VuJyk7XG4gICAgICAgIHNldFVzZXIobnVsbCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIENhbGwgdGhlIGxvYWQgZnVuY3Rpb25cbiAgICBsb2FkVXNlcigpO1xuICB9LCBbXSk7XG5cbiAgLy8gTG9naW4gZnVuY3Rpb25cbiAgY29uc3QgbG9naW4gPSBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zb2xlLmxvZyhgTG9naW4gYXR0ZW1wdDogdXNlcm5hbWU9JHt1c2VybmFtZX0sIHBhc3N3b3JkPSR7cGFzc3dvcmQubGVuZ3RofSBjaGFyc2ApO1xuICAgICAgXG4gICAgICAvLyBGb3IgZGVtbyBwdXJwb3NlcywgYWNjZXB0IGFueSBsb2dpbiB3aXRoIHVzZXJuYW1lIFwidGVzdHVzZXJcIiBhbmQgcGFzc3dvcmQgXCJQYXNzd29yZDEyM1wiXG4gICAgICBpZiAodXNlcm5hbWUgPT09IFwidGVzdHVzZXJcIiAmJiBwYXNzd29yZCA9PT0gXCJQYXNzd29yZDEyM1wiKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHNpbXBsZSB0b2tlblxuICAgICAgICBjb25zdCB0b2tlbiA9IFwidGVzdHVzZXI6MTpcIiArIERhdGUubm93KCk7XG4gICAgICAgIFxuICAgICAgICAvLyBTdG9yZSB0aGUgdG9rZW5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2F1dGhUb2tlbicsIHRva2VuKTtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB1c2VyIG9iamVjdFxuICAgICAgICBjb25zdCB1c2VyRGF0YSA9IHtcbiAgICAgICAgICBpZDogMSxcbiAgICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgICBlbWFpbDogYCR7dXNlcm5hbWV9QGV4YW1wbGUuY29tYCxcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNldCB1c2VyIGFuZCByZWRpcmVjdFxuICAgICAgICBzZXRVc2VyKHVzZXJEYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgc2V0LCByZWRpcmVjdGluZyB0byBob21lJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBVc2UgYSBzaG9ydCBkZWxheSBmb3Igc3RhdGUgdG8gdXBkYXRlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5wdXNoKCcvJyk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHVzZXJuYW1lIG9yIHBhc3N3b3JkXCIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdMb2dpbiBlcnJvcjonLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH07XG5cbiAgLy8gTG9nb3V0IGZ1bmN0aW9uXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnTG9nZ2luZyBvdXQnKTtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aFRva2VuJyk7XG4gICAgc2V0VXNlcihudWxsKTtcbiAgICByb3V0ZXIucHVzaCgnL2xvZ2luJyk7XG4gIH07XG5cbiAgLy8gUmVnaXN0ZXIgZnVuY3Rpb24gKHNpbXBsaWZpZWQpXG4gIGNvbnN0IHJlZ2lzdGVyID0gYXN5bmMgKHVzZXJuYW1lOiBzdHJpbmcsIGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc29sZS5sb2coYFJlZ2lzdHJhdGlvbiBhdHRlbXB0OiB1c2VybmFtZT0ke3VzZXJuYW1lfSwgZW1haWw9JHtlbWFpbH1gKTtcbiAgICAgIFxuICAgICAgLy8gRm9yIGRlbW8gcHVycG9zZXMsIGp1c3QgbG9naW4gYWZ0ZXIgcmVnaXN0cmF0aW9uXG4gICAgICBhd2FpdCBsb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdSZWdpc3RyYXRpb24gZXJyb3I6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcHJvdmlkZXIgd2l0aCBhbGwgdmFsdWVzXG4gIHJldHVybiAoXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHVzZXIsIGxvYWRpbmcsIGxvZ2luLCBsb2dvdXQsIHJlZ2lzdGVyIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59O1xuXG4vLyBIb29rIHRvIHVzZSBhdXRoXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHVzZUNvbnRleHQoQXV0aENvbnRleHQpOyJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlUm91dGVyIiwiQXV0aENvbnRleHQiLCJ1c2VyIiwibG9hZGluZyIsImxvZ2luIiwibG9nb3V0IiwicmVnaXN0ZXIiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInNldFVzZXIiLCJzZXRMb2FkaW5nIiwicm91dGVyIiwiY29uc29sZSIsImxvZyIsImxvYWRVc2VyIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwidXNlckRhdGEiLCJpZCIsInVzZXJuYW1lIiwiZW1haWwiLCJlcnJvciIsInJlbW92ZUl0ZW0iLCJwYXNzd29yZCIsImxlbmd0aCIsIkRhdGUiLCJub3ciLCJzZXRJdGVtIiwic2V0VGltZW91dCIsInB1c2giLCJFcnJvciIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VBdXRoIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./lib/auth.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/auth */ \"(pages-dir-node)/./lib/auth.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n// frontend/pages/_app.tsx (update this file)\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/home/xavierdev/coding_projects/twinglish/frontend/pages/_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/xavierdev/coding_projects/twinglish/frontend/pages/_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDZDQUE2Qzs7QUFDRjtBQUNaO0FBRy9CLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDL0MscUJBQ0UsOERBQUNILG1EQUFZQTtrQkFDWCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyIvaG9tZS94YXZpZXJkZXYvY29kaW5nX3Byb2plY3RzL3R3aW5nbGlzaC9mcm9udGVuZC9wYWdlcy9fYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmcm9udGVuZC9wYWdlcy9fYXBwLnRzeCAodXBkYXRlIHRoaXMgZmlsZSlcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2xpYi9hdXRoJztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvQXV0aFByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsiXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();