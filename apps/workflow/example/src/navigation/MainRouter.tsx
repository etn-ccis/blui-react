import React, { useCallback, useEffect } from 'react';
import {
    AuthContextProvider,
    OktaAuthContextProvider,
    ContactSupportScreen,
    ReactRouterAuthGuard,
    ReactRouterGuestGuard,
    ForgotPasswordScreen,
    RegistrationContextProvider,
    ResetPasswordScreen,
    RegistrationWorkflow,
} from '@brightlayer-ui/react-auth-workflow';
import { useApp } from '../contexts/AppContextProvider';
import { ProjectAuthUIActions } from '../actions/AuthUIActions';
import { Navigate, Outlet, Route, Routes, To, useNavigate } from 'react-router-dom';
import { ProjectRegistrationUIActions } from '../actions/RegistrationUIActions';
import { routes } from './Routing';
import { ExampleHome } from '../screens/ExampleHome';
import i18nAppInstance from '../translations/i18n';
import { ChangePassword } from '../components/ChangePassword';
import { OktaLogin } from '../screens/OktaRedirectLogin';
import { useOktaAuth, LoginCallback } from '@okta/okta-react';

export const MainRouter: React.FC = () => {
    const navigation = useNavigate();
    const app = useApp();
    const { email, rememberMe } = app.loginData;
    const navigate = useCallback(
        (destination: -1 | string) => {
            navigation(destination as To);
        },
        [navigation]
    );
    const { authState } = useOktaAuth();

    const { setIsAuthenticated } = useApp();

    useEffect(() => {
        if (authState?.isAuthenticated) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [authState, setIsAuthenticated]);

    return (
        <Routes>
            {/* AUTH ROUTES */}
            <Route
                element={
                    <AuthContextProvider
                        actions={ProjectAuthUIActions(app)}
                        language={app.language}
                        navigate={navigate}
                        routeConfig={routes}
                        i18n={i18nAppInstance}
                        rememberMeDetails={{ email: rememberMe ? email : '', rememberMe: rememberMe }}
                    >
                        <Outlet />
                    </AuthContextProvider>
                }
            >
                <Route
                    path={'/login'}
                    element={
                        <ReactRouterGuestGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/'}>
                            <OktaAuthContextProvider
                                language={app.language}
                                navigate={navigate}
                                routeConfig={routes}
                                i18n={i18nAppInstance}
                            >
                                <OktaLogin />
                            </OktaAuthContextProvider>
                        </ReactRouterGuestGuard>
                    }
                />
                <Route
                    path={'/forgot-password'}
                    element={
                        <ReactRouterGuestGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/'}>
                            <ForgotPasswordScreen />
                        </ReactRouterGuestGuard>
                    }
                />
                <Route
                    path={'/contact-support'}
                    element={
                        <ReactRouterGuestGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/'}>
                            <ContactSupportScreen />
                        </ReactRouterGuestGuard>
                    }
                />
                <Route
                    path={'/reset-password'}
                    element={
                        <ReactRouterGuestGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/'}>
                            <ResetPasswordScreen />
                        </ReactRouterGuestGuard>
                    }
                />
                {/* USER APPLICATION ROUTES */}
                <Route
                    element={
                        <>
                            <Outlet />
                            {app.showChangePasswordDialog && <ChangePassword />}
                        </>
                    }
                >
                    <Route
                        path={'/login/callback'}
                        element={
                            <ReactRouterGuestGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/'}>
                                <LoginCallback />
                            </ReactRouterGuestGuard>
                        }
                    />
                    <Route
                        path={'/homepage'}
                        element={
                            <ReactRouterAuthGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/login'}>
                                <ExampleHome />
                            </ReactRouterAuthGuard>
                        }
                    />
                    <Route path={'/'} element={<Navigate to={'/homepage'} replace />} />
                </Route>
                <Route
                    path={'*'}
                    element={
                        <ReactRouterAuthGuard isAuthenticated={app.isAuthenticated} fallBackUrl={'/login'}>
                            <Navigate to={'/login'} />
                        </ReactRouterAuthGuard>
                    }
                />
            </Route>
            {/* REGISTRATION ROUTES */}
            <Route
                element={
                    <RegistrationContextProvider
                        language={app.language}
                        routeConfig={routes}
                        navigate={navigate}
                        actions={ProjectRegistrationUIActions()}
                        i18n={i18nAppInstance}
                    >
                        <Outlet />
                    </RegistrationContextProvider>
                }
            >
                <Route path={'/self-registration'} element={<RegistrationWorkflow />} />
                <Route path={'/register-by-invite'} element={<RegistrationWorkflow isInviteRegistration />} />
            </Route>
        </Routes>
    );
};
