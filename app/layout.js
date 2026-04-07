export const metadata = {
  title: '10AMPRO Robespierre — Collective Intelligence Dashboard',
  description: 'WhatsApp group engagement analytics and collective intelligence metrics for 10AMPRO',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body style={{margin:0,padding:0,background:"#0a0a0f"}}>
        {children}
      </body>
    </html>
  )
}
