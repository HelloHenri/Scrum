from dotenv import load_dotenv
from flask import Flask, request, jsonify
import bcrypt
import os
import jwt
import datetime
import psycopg2
from functools import wraps
from flask_cors import CORS

# Carregar variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Chave secreta e URL do banco de dados a partir do arquivo .env
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'minha_chave_secreta')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://usuario:senha@localhost:5432/sistema_avaliacao')

# Função de conexão com o banco de dados
def connect_to_database():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except psycopg2.Error as err:
        print(f"Erro ao conectar ao banco de dados: {err}")
        return None

# Função para verificar a senha
def verificar_senha(senha_fornecida, senha_db):
    return bcrypt.checkpw(senha_fornecida.encode('utf-8'), senha_db.encode('utf-8'))


def criar_usuario(username, email, password, role):
    conn = connect_to_database()
    if conn is None:
        return {'error': 'Erro ao conectar ao banco de dados'}, 500
    
    cursor = conn.cursor()
    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        query = "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (username, email, hashed_password, role))
        conn.commit()
        return {'msg': 'Usuário criado com sucesso'}, 201
    except psycopg2.Error as err:
        print(f"Erro ao criar usuário: {err}")
        return {'error': 'Erro ao criar usuário'}, 500
    finally:
        cursor.close()
        conn.close()


def verify_credentials(email, password):
    conn = connect_to_database()
    if conn is None:
        return {'error': 'Erro ao conectar ao banco de dados'}, 500

    cursor = conn.cursor()
    try:
        query = "SELECT password, role, id FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        if result:
            password_db, role, user_id = result
            if verificar_senha(password, password_db):  # Verificando a senha
                return role, user_id  # Credenciais válidas
            return {'error': 'Senha incorreta'}, 401  # Senha incorreta
        return {'error': 'Usuário não encontrado'}, 404  # Usuário não encontrado
    except psycopg2.Error as err:
        print(f"Erro ao consultar o banco de dados: {err}")
        return {'error': 'Erro interno do servidor'}, 500
    finally:
        cursor.close()
        conn.close()

# Função para gerar o token JWT
def gerar_token(user_id, role):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {'user_id': user_id, 'role': role, 'exp': expiration_time}
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'Token de autenticação não fornecido'}), 403

            try:
                if token.startswith('Bearer '):
                    token = token.split(" ")[1]
                else:
                    return jsonify({'error': 'Token mal formatado'}), 403

                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                role = payload['role']
                user_id = payload['user_id']

                if role != required_role and role != 'admin':
                    return jsonify({'error': 'Acesso não autorizado'}), 403

                return f(*args, **kwargs, user_id=user_id)
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token expirado'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Token inválido'}), 401
        return decorated_function
    return decorator

# Rota de login para gerar o token JWT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    result = verify_credentials(email, password)

    if isinstance(result, tuple):
        role, user_id = result
        token = gerar_token(user_id, role)
        return jsonify({'token': token}), 200
    return jsonify(result), result.get('status', 500)


@app.route('/create_user', methods=['POST'])
@role_required('admin')
def create_user(user_id):
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username or not email or not password or not role:
        return jsonify({'error': 'Todos os campos são obrigatórios'}), 400

    if role not in ['admin', 'manager', 'user']:
        return jsonify({'error': 'Role inválido'}), 400

    response, status = criar_usuario(username, email, password, role)
    return jsonify(response), status

@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
@role_required('admin')
def delete_user(user_id):
    conn = connect_to_database()
    if conn is None:
        return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500

    cursor = conn.cursor()
    try:
        query = "DELETE FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        conn.commit()
        return jsonify({'success': 'Usuário excluído com sucesso'}), 200
    except psycopg2.Error as err:
        print(f"Erro ao excluir usuário: {err}")
        return jsonify({'error': 'Erro ao excluir usuário'}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/tasks', methods=['GET'])
@role_required('user')
def get_tasks(user_id):
    try:
        conn = connect_to_database()
        if conn is None:
            return jsonify({'error': 'Erro ao conectar ao banco de dados'}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE user_id = %s OR user_id IS NULL", (user_id,))
        tasks = cursor.fetchall()
        return jsonify({'tasks': tasks}), 200
    except Exception as e:
        print(f"Erro ao obter tarefas: {e}")
        return jsonify({'error': 'Erro ao obter tarefas'}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)