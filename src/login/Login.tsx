import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

// Validação do email e senha com Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Campo obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Campo obrigatório'),
});

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagens de erro
  const [loading, setLoading] = useState(false); // Estado para o carregamento
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true); // Inicia o estado de loading
    setErrorMessage(''); // Limpa mensagens de erro ao tentar enviar o formulário

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`, // URL configurável via .env
        {
          email: data.email,
          password: data.password,
        },
        {
          timeout: 5000, // Define um timeout para a requisição
        }
      );

      const { token, role } = response.data;
      if (!token || !role) {
        throw new Error('Token ou role não encontrados na resposta.');
      }

      // Armazenar o token e o role do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirecionamento condicional baseado no role
      if (role === 'admin') {
        navigate('/admin'); // Redireciona para o painel de admin
      } else if (role === 'gerente') {
        navigate('/gerente'); // Redireciona para o painel de gerente
      } else {
        navigate('/usuario'); // Redireciona para o painel de usuário
      }
    } catch (error: any) {
      // Tratamento de erros
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            setErrorMessage('Credenciais inválidas, por favor tente novamente.');
          } else {
            setErrorMessage(data.error || 'Erro desconhecido.');
          }
        } else if (error.request) {
          setErrorMessage('Erro ao conectar com o servidor. Tente novamente.');
        } else {
          setErrorMessage('Erro inesperado. Tente novamente.');
        }
      } else {
        setErrorMessage(error.message || 'Erro desconhecido.');
      }
    } finally {
      setLoading(false); // Finaliza o estado de loading
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-group">
          <label htmlFor="email">E-Mail</label>
          <input
            id="email"
            type="email"
            placeholder="E-Mail"
            {...register('email')}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Senha"
            {...register('password')}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`submit-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>

      {errorMessage && (
        <div className="error-message error-general">{errorMessage}</div>
      )}

      <div className="forgot-password">Esqueceu a senha?</div>
    </div>
  );
};

export default Login;