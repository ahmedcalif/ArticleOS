interface AuthData {
    logged_in: boolean;
    user_id: number | null;
    user: any | null;
}

interface DirectAuthTestProps {
    authData: AuthData;
}

export default function DirectAuthTest({ authData }: DirectAuthTestProps) {
    return (
        <div className="p-8">
            <h1 className="mb-4 text-xl font-bold">Auth Test</h1>
            <div className="rounded bg-gray-100 p-4">
                <pre>{JSON.stringify(authData, null, 2)}</pre>
            </div>
        </div>
    );
}
