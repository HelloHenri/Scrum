PGDMP  )    	            
    |            sistema_avaliacao    17.1    17.1 $               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16470    sistema_avaliacao    DATABASE     �   CREATE DATABASE sistema_avaliacao WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';
 !   DROP DATABASE sistema_avaliacao;
                     postgres    false            �            1259    16641    processos_avaliacao    TABLE     �   CREATE TABLE public.processos_avaliacao (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    criado_por integer NOT NULL
);
 '   DROP TABLE public.processos_avaliacao;
       public         heap r       postgres    false            �            1259    16640    processos_avaliacao_id_seq    SEQUENCE     �   CREATE SEQUENCE public.processos_avaliacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.processos_avaliacao_id_seq;
       public               postgres    false    222                       0    0    processos_avaliacao_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.processos_avaliacao_id_seq OWNED BY public.processos_avaliacao.id;
          public               postgres    false    221            �            1259    16656    tarefas    TABLE     �   CREATE TABLE public.tarefas (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL,
    descricao text,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    criado_por integer NOT NULL
);
    DROP TABLE public.tarefas;
       public         heap r       postgres    false            �            1259    16655    tarefas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tarefas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.tarefas_id_seq;
       public               postgres    false    224                       0    0    tarefas_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.tarefas_id_seq OWNED BY public.tarefas.id;
          public               postgres    false    223            �            1259    16629    users    TABLE     O  CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(20) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'gerente'::character varying, 'usuario'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16628    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            �            1259    16544    usuarios    TABLE     �  CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senha_hash text NOT NULL,
    tipo character varying(20) NOT NULL,
    CONSTRAINT usuarios_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['admin'::character varying, 'gerente'::character varying, 'usuario'::character varying])::text[])))
);
    DROP TABLE public.usuarios;
       public         heap r       postgres    false            �            1259    16543    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public               postgres    false    218                       0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public               postgres    false    217            h           2604    16644    processos_avaliacao id    DEFAULT     �   ALTER TABLE ONLY public.processos_avaliacao ALTER COLUMN id SET DEFAULT nextval('public.processos_avaliacao_id_seq'::regclass);
 E   ALTER TABLE public.processos_avaliacao ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            j           2604    16659 
   tarefas id    DEFAULT     h   ALTER TABLE ONLY public.tarefas ALTER COLUMN id SET DEFAULT nextval('public.tarefas_id_seq'::regclass);
 9   ALTER TABLE public.tarefas ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            g           2604    16632    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            f           2604    16547    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218                      0    16641    processos_avaliacao 
   TABLE DATA           \   COPY public.processos_avaliacao (id, nome, descricao, data_criacao, criado_por) FROM stdin;
    public               postgres    false    222   }*                 0    16656    tarefas 
   TABLE DATA           R   COPY public.tarefas (id, titulo, descricao, data_criacao, criado_por) FROM stdin;
    public               postgres    false    224   �*                 0    16629    users 
   TABLE DATA           :   COPY public.users (id, email, password, role) FROM stdin;
    public               postgres    false    220   �*                 0    16544    usuarios 
   TABLE DATA           E   COPY public.usuarios (id, nome, email, senha_hash, tipo) FROM stdin;
    public               postgres    false    218   &+                  0    0    processos_avaliacao_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.processos_avaliacao_id_seq', 1, false);
          public               postgres    false    221                        0    0    tarefas_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.tarefas_id_seq', 1, false);
          public               postgres    false    223            !           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public               postgres    false    219            "           0    0    usuarios_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);
          public               postgres    false    217            w           2606    16649 ,   processos_avaliacao processos_avaliacao_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.processos_avaliacao
    ADD CONSTRAINT processos_avaliacao_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.processos_avaliacao DROP CONSTRAINT processos_avaliacao_pkey;
       public                 postgres    false    222            y           2606    16664    tarefas tarefas_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.tarefas
    ADD CONSTRAINT tarefas_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.tarefas DROP CONSTRAINT tarefas_pkey;
       public                 postgres    false    224            s           2606    16639    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    220            u           2606    16637    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            o           2606    16554    usuarios usuarios_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
       public                 postgres    false    218            q           2606    16552    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public                 postgres    false    218            z           2606    16650 7   processos_avaliacao processos_avaliacao_criado_por_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.processos_avaliacao
    ADD CONSTRAINT processos_avaliacao_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.users(id) ON DELETE CASCADE;
 a   ALTER TABLE ONLY public.processos_avaliacao DROP CONSTRAINT processos_avaliacao_criado_por_fkey;
       public               postgres    false    220    4725    222            {           2606    16665    tarefas tarefas_criado_por_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tarefas
    ADD CONSTRAINT tarefas_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.users(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.tarefas DROP CONSTRAINT tarefas_criado_por_fkey;
       public               postgres    false    220    4725    224                  x������ � �            x������ � �         _   x�m�K�  �u{#��փ���`h#���ؿyDj�Ԣ�n����%Z�T��)�]D���Z�|���a"��� [�ۺ�4ڠ*�炈��,�            x�m�=�0@��>EOP�V*+����	V���%?ǧ�S��=�g�nY��Bb�TL�xI��w
�$����EL�~�r^�.NK4x�fy7~�7�;2lG�K�,���j��q�-�{��_]�>g     