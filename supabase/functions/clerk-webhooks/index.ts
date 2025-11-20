import { createClient } from 'npm:@supabase/supabase-js'
import { verifyWebhook } from 'npm:@clerk/backend/webhooks'

Deno.serve(async (req) => {
  // Verify webhook signature
  const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET')

  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const event = await verifyWebhook(req, { signingSecret: webhookSecret })

  // Create supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response('Supabase credentials not configured', { status: 500 })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  switch (event.type) {
    case 'user.created': {
      // Handle user creation with transaction for both users and week_progress
      const { data, error } = await supabase.rpc('begin')
      
      try {
        // Insert user
        const { data: user, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: event.data.id,
              first_name: event.data.first_name,
              last_name: event.data.last_name,
              avatar_url: event.data.image_url,
              email: event.data.email_addresses[0].email_address,
              created_at: new Date(event.data.created_at).toISOString(),
              updated_at: new Date(event.data.updated_at).toISOString(),
            },
          ])
          .select()
          .single()

        if (userError) throw userError

        // Insert week progress
        const { data: weekProgress, error: weekProgressError } = await supabase
          .from('week_progress')
          .insert([
            {
              user_id: event.data.id,
              week_id: 1,
            },
          ])
          .select()
          .single()

        if (weekProgressError) throw weekProgressError

        // Commit transaction
        await supabase.rpc('commit')

        return new Response(JSON.stringify({ user, weekProgress }), { status: 200 })
      } catch (error) {
        // Rollback transaction
        await supabase.rpc('rollback')
        console.error('Error creating user:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
      }
    }
    default: {
      // Unhandled event type
      console.log('Unhandled event type:', JSON.stringify(event, null, 2))
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }
  }
})