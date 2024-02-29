export default function ({ $auth, redirect }) {
    const { name } = $auth.user?.role;

    if (name === 'admin') {
        return redirect({ name: 'employees' });
    }

    return redirect({ name: 'vacation-status' });
}
