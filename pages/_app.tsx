import React from 'react'
import { ChakraProvider, Container, VStack, Image, Box, Divider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import theme from 'comidasya/theme'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" padding={5}>
      {/* @ts-ignore */}
      <Container backgroundColor="black" boxShadow="md" padding={6} borderRadius="sm" >
        <VStack alignItems="center">
          <Image width={300} src="https://res.cloudinary.com/dwz4lcvya/image/upload/v1704900399/don-logo_lp1kvo.png" alt=""></Image>
        </VStack>
        <Divider marginY={3} />
        <Component {...pageProps} />
      </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App