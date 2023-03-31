import { Button, Grid, Stack, Text, Link, Flex, Image} from '@chakra-ui/react';
import api from 'comidasya/product/api';
import { Product } from 'comidasya/product/types';
import { GetStaticProps } from 'next';
import React from 'react'

interface Props {
  products: Product[]
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([])
  const text = React.useMemo(() => cart
    .reduce((message, product) => message.concat(`${product.producto}: $${product.precio} |\n`), ``)
    .concat(`\nTOTAL: $${cart.reduce((total, product) => total + product.precio, 0)}`),
    [cart])

  return (
    // @ts-ignore
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack borderRadius="md" padding={4} backgroundColor="gray.100" key={product.id}>
            <Image maxHeight={200} objectFit="cover" src={product.imagen} />
            <Text>{product.producto}</Text>
            <Text fontWeight="500">$ {product.precio}</Text>
            <Button colorScheme="primary" onClick={() => setCart((cart) => cart.concat(product))}>Agregar al pedido</Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && 
        <Flex position="sticky" bottom={12} justifyContent="center" alignItems="center">
          {/* @ts-ignore */}
          <Button
            colorScheme="green"
            as={Link}
            isExternal
            href={`https://wa.me/3483521462?text=${encodeURIComponent(text)}`}
          >
            Completar pedido ({cart.length} productos)
          </Button>
        </Flex>
      }
      {Boolean(cart.length) &&
        <Flex position="sticky" bottom={2} justifyContent="center" alignItems="center">
          <Button
            width="268px"
            colorScheme="red"
            onClick={() => setCart([])}>
            Eliminar pedido
          </Button>
        </Flex>
      }
    </Stack>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list()
  return {
    revalidate: 10,
    props: {
      products,
    },
  }
}

export default Home;