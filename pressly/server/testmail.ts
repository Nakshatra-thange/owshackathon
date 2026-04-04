import dotenv from 'dotenv'
dotenv.config()

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function test() {
  console.log('API Key:', process.env.RESEND_API_KEY?.slice(0, 10))
  
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'nakshthange@gmail.com',
    subject: 'Pressly Test',
    html: '<p>Test email from Pressly</p>'
  })
  
  console.log('Result:', JSON.stringify(result, null, 2))
}

test().catch(console.error)