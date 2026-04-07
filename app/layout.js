export const metadata = {
  title: '10AMPRO Club — Open Source Capital · Collective Intelligence · Network Sharing',
  description: 'The three pillars to belong. AI-graded member analytics for the 10AMPRO investment community.',
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body style={{margin:0,padding:0,background:"#0a0a0f",WebkitFontSmoothing:"antialiased",overflowX:"hidden"}}>
        {children}
      </body>
    </html>
  )
}
