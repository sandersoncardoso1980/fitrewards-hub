import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.79.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('VITE_SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const demoUsers = [
      {
        email: 'admin@fitquest.com',
        password: 'admin123',
        name: 'Admin FitQuest',
        role: 'admin'
      },
      {
        email: 'user1@fitquest.com',
        password: 'user123',
        name: 'João Silva',
        role: 'user'
      },
      {
        email: 'user2@fitquest.com',
        password: 'user123',
        name: 'Maria Santos',
        role: 'user'
      }
    ]

    const results = []

    for (const user of demoUsers) {
      // Verificar se usuário já existe
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUser?.users.some(u => u.email === user.email)

      if (!userExists) {
        // Criar usuário
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name
          }
        })

        if (createError) {
          results.push({ email: user.email, status: 'error', message: createError.message })
          continue
        }

        // Atribuir role
        if (newUser.user && user.role === 'admin') {
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', newUser.user.id)

          await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: newUser.user.id, role: 'admin' })
        }

        results.push({ email: user.email, status: 'created' })
      } else {
        results.push({ email: user.email, status: 'already_exists' })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
