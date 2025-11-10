-- Atribuir role admin ao usuário admin@fitquest.com
-- Nota: Este script só funcionará após o usuário fazer signup com o email admin@fitquest.com

-- Criar função auxiliar para atribuir admin role por email
CREATE OR REPLACE FUNCTION public.assign_admin_by_email(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Buscar user_id pelo email
  SELECT id INTO _user_id
  FROM auth.users
  WHERE email = _email;
  
  IF _user_id IS NOT NULL THEN
    -- Remover role existente se houver
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- Atribuir role admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin');
  END IF;
END;
$$;

-- Executar para o usuário admin (só funcionará se o usuário já tiver feito signup)
DO $$
BEGIN
  PERFORM public.assign_admin_by_email('admin@fitquest.com');
END $$;