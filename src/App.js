import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { UserProvider, useUser } from "./lib/context/user";
import {RecipesProvider} from "./lib/context/recipes"

function App() {
    const isLoginPage = (window.location.pathname === "/login");

    return (
        <div className="bg-amber-500 bg-auto pl-20 pr-20 pt-5 h-max overflow-hidden">
            <UserProvider>
                <RecipesProvider>
                    <Navbar /> {/* Add the navbar before page content */}
                    <main className="flex items-center flex-col gap-2 pt-4 pb-4">{isLoginPage ? <Login /> : <Home />}</main>
                    <div className="h-full opacity-0 flex-col-reverse">
                        {["a", "b", "c", "d", "b", "c", "d", "b", "c", "d", "b", "c", "d", "b"].map((elem) => {
                            return <li>elem</li>
                        })}
                    </div>
                </RecipesProvider>
            </UserProvider>
        </div>
    );
}

function Navbar() {
    const user = useUser();

    return (
        <nav className="bg-amber-200 flex rounded-2xl flex-col gap-2 items-center p-10">
            <a className="text-zinc-50 bg-blue-700 p-2 rounded-xl" href="/">Recipe tracker</a>
            <div className="flex items-center gap-2">
                {user.current ? (
                    <>
                        <span>{"Welcome! " + user.current.email}</span>
                        <button className=" text-zinc-50 bg-blue-700 rounded-2xl p-1" type="button" onClick={() => user.logout()}>
                            Logout
                        </button>
                    </>
                ) : (
                    <a href="/login">Login</a>
                )}
            </div>
        </nav>
    );
}

export default App;
