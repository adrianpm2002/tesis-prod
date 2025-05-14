import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 🔹 Importamos lo necesario
import Router from './routes/Router';
import { baselightTheme } from "./theme/DefaultColors";

function App() {
    const theme = baselightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter> {/* ✅ Aseguramos que BrowserRouter envuelve las rutas */}
                <Routes> {/* ✅ Cambiamos useRoutes a Routes */}
                    {Router.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element}>
                            {route.children?.map((child, i) => (
                                <Route key={i} path={child.path} element={child.element} />
                            ))}
                        </Route>
                    ))}
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;