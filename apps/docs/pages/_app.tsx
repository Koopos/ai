import { AppProps } from 'next/app'
import { ResetStyles } from '@ui-library/ui/styles'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ResetStyles />
      <Component {...pageProps} />
    </>
  )
}
