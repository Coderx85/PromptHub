import "@styles/globals.css";

import Nav from "@components/Nav";

export const metadata = {
  title: "PromptHub",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang='en' data-theme='black'>
    <body>
        <div className='main'>
          <div className='gradient' />
        </div>
        <main className='app'>
          <Nav />
          {children}
        </main>
    </body>
  </html>
);

export default RootLayout;
