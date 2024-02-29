export default function ({ $auth, redirect }) {
    const { loggedIn } = $auth;

    if (loggedIn) {
        return redirect({ name: 'index' });
    }
}
