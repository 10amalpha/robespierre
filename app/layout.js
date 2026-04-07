export const metadata = {
  title: '10AMPRO Robespierre — Collective Intelligence Dashboard',
  description: 'WhatsApp group engagement analytics and collective intelligence metrics for 10AMPRO',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body style={{margin:0,padding:0,background:"#0a0a0f",WebkitFontSmoothing:"antialiased",overflowX:"hidden"}}>
        {children}
      </body>
    </html>
  )
}
