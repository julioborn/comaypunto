import React from 'react'
import { ChakraProvider, Container, VStack, Image, Box, Divider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import theme from 'comidasya/theme'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
      {/* @ts-ignore */}
      <Container backgroundColor="black" boxShadow="md" maxWidth="container.xl" padding={4} borderRadius="sm" >
        <VStack>
          <Image width={300} src="https://res.cloudinary.com/dwz4lcvya/image/upload/v1704900399/don-logo_lp1kvo.png"></Image>
        </VStack>
        <Divider marginY={3} />
        <Component {...pageProps} />
      </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App