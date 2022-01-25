import LandingPage from './pages/LandingPage';
import Playground from './pages/Playground';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AuthContextProvider, { useAuth } from './contexts/AuthContext';
import MessageBoxContextProvider from './contexts/MessageBox';
import ProfilePage from './pages/ProfilePage';
import { useEffect, useState } from 'react';
import Loading from './components/LoadingAnimation';
import MessageWindow from './components/MessageWindow';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProxyPlayground from './pages/ProxyPlayground';

function App() {

	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	return (
		<AuthContextProvider>
			<MessageBoxContextProvider>
				{/* basename='/l-code-session-master' */}
				<BrowserRouter>
					{isMobile() ? <LandingPage mobile={true} /> : <div className="App">
						<MessageWindow />
						<Routes>
							<Route exact path="/" element={
								<RequireAuth>
									<LandingPage />
								</RequireAuth>
							} />
							<Route exact path="/playground/:projectId" element={
								<RequireAuth>
									<Playground />
								</RequireAuth>
							} />
							<Route exact path="/playground" element={
								<RequireAuth>
									<ProxyPlayground />
								</RequireAuth>
							} />
							<Route exact path="/register" element={
								<RequireAuth>
									<RegisterPage />
								</RequireAuth>} />
							<Route exact path="/login" element={
								<RequireAuth>
									<LoginPage />
								</RequireAuth>
							} />
							<Route exact path="/forgot-password" element={
								<RequireAuth>
									<ForgotPasswordPage />
								</RequireAuth>} />
							<Route exact path="/reset-password" element={
								<RequireAuth>
									<ResetPasswordPage />
								</RequireAuth>} />
							<Route exact path="/profile" element={
								<RequireAuth>
									<ProfilePage />
								</RequireAuth>
							} />
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</div>}
				</BrowserRouter>
			</MessageBoxContextProvider>
		</AuthContextProvider>
	);
}


function RequireAuth({ children }) {
	const { currentUser } = useAuth();
	const location = useLocation();
	const { state } = useLocation();

	if (location.pathname == "/register" || location.pathname == "/login"
		|| location.pathname == "/forgot-password" || location.pathname == "/reset-password"
		|| location.pathname == "/" || location.pathname === "/playground"
	) {
		if (currentUser?.loading) return <Loading color="black" />
		else return currentUser ? <Navigate to="/profile" state={{ path: state?.path }} /> : children;
	} else {
		return currentUser ? children
			: <Navigate to="/login"
				state={{ path: location.pathname }}
			/>
	}
}
export default App;
