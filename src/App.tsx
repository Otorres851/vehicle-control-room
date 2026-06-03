import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Vehicle Control Room</h1>

      <p>{theme}</p>

      <button onClick={toggleTheme}>Toggle Theme</button>
    </main>
  );
}

export default App;
