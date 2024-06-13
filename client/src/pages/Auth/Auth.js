import AuthForm from '../../components/auth/AuthForm';

function AuthenticationPage({ socket }) {
  return <AuthForm socket={socket} />;
}

export default AuthenticationPage;
