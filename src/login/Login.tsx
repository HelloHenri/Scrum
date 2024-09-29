
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

interface LoginFormInputs {
  email: string;
  password: string;
}

// Validação do email
const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Campo obrigatório'),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Campo obrigatório'),
});

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormInputs) => {
    console.log(data); 
    navigate('/scrum'); 
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">E-Mail</label>
          <input id="email" type="text" placeholder="E-Mail" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="Senha" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Entrar</button>
      </form>
      <div className="forgot-password">Esqueceu a senha?</div>
    </div>
  );
};

export default Login;
