import { Head, Link } from '@inertiajs/react';

interface WelcomeProps {
    auth: {
        user: Record<string, any> | null;
    };
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion?: string;
    phpVersion?: string;
}

export default function Welcome({ auth, canLogin, canRegister }: WelcomeProps) {
    return (
        <>
            <Head title="LinuxHub - A Community for Linux Users" />
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="flex min-h-screen flex-col items-center justify-center p-6">
                    <div className="mb-12 flex flex-col items-center">
                        <div className="rounded-full bg-gray-900 p-1">
                            <img src="/linuxlogo.png" alt="Linux Penguin Logo" className="h-32 w-32" />
                        </div>
                        <h1 className="mb-2 text-center text-6xl font-bold">ArticleOS</h1>
                        <p className="max-w-lg text-center text-xl text-gray-400">
                            The community-driven forum for Linux enthusiasts, developers, and newcomers
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-gray-700 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-600"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
