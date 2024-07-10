import './tailwind.css'
import {
  createCookieSessionStorage,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from '@remix-run/react'
import {
  createThemeSessionResolver,
  PreventFlashOnWrongTheme,
  type Theme,
  ThemeProvider,
  useTheme,
} from 'remix-themes'
import DefaultErrorBoundary from '~/components/ui/error-boundary'
import iconsHref from '~/components/ui/icons/sprite.svg?url'

export const links: LinksFunction = () => [
  { rel: 'prefetch', href: iconsHref, as: 'image' },
]

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__remix-themes',
    // domain: 'remix.run',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: ['s3cr3t'],
    // secure: true,
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  return json({ theme: getTheme() })
}

function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const [theme] = useTheme()

  return (
    <html lang="en" data-theme={theme} className={theme ?? ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="bg-white text-black dark:bg-black dark:text-white"
        suppressHydrationWarning
      >
        {children}
        <ScrollRestoration />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
        <Scripts />
      </body>
    </html>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider
      specifiedTheme={data?.theme as Theme}
      themeAction="/resources/set-theme"
    >
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}

export function ErrorBoundary() {
  return (
    <Providers>
      <DefaultErrorBoundary />
    </Providers>
  )
}

export function HydrateFallback() {
  return (
    <Providers>
      <h1>Loading...</h1>
    </Providers>
  )
}
