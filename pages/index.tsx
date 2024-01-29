import { Button, Icon, Grid, Stack, Text, Link, Flex, Image, Box } from '@chakra-ui/react';
import api from 'comidasya/product/api';
import { Product } from 'comidasya/product/types';
import { GetStaticProps } from 'next';
import React from 'react';
import Swal from 'sweetalert2';
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { PiNotePencilBold } from "react-icons/pi";
import { FiShoppingCart } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const addToCart = (product: Product) => {
    setCart((cart) => [...cart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((cart) => cart.filter((product) => product.id !== productId));
  };

  const text = React.useMemo(
    () =>
      cart
        .reduce((message, product) => message.concat(`* ${product.producto}: $${product.precio}\n`), ``)
        .concat(`- Total: $${cart.reduce((total, product) => total + product.precio, 0)}`),
    [cart]
  );

  return (
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack borderRadius="md" padding={4} backgroundColor="yellow.200" key={product.id}>
            <Image maxHeight={300} borderRadius={5} objectFit="cover" src={product.imagen} alt="" />
            <Text fontWeight="700">{product.producto}</Text>
            <Text fontWeight="400">{product.descripcion}</Text>
            <Text fontWeight="500">$ {product.precio}</Text>
            <Button colorScheme="primary" onClick={() => addToCart(product)}>
              Agregar al pedido
            </Button>
          </Stack>
        ))}
      </Grid>

      {Boolean(cart.length) && (
        <Flex position="fixed" top={0} right={6} justifyContent="center" alignItems="center">
          <Button width="60px" height="60px" borderRadius="30px" colorScheme="green" onClick={onOpen}>
            <Box display="flex" gap="5px">
              <FiShoppingCart size="20px" />
              {cart.length}
            </Box>
          </Button>
        </Flex>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody backgroundColor="yellow.500">
            <Text color="black" display="flex" alignItems="center" gap="5px" fontSize="lg" fontWeight="bold" marginBottom={2}>
              Pedido <PiNotePencilBold size="22px" />
            </Text>
            <Box borderRadius="md" padding={4} backgroundColor="gray.100">
              {cart.map((product) => (
                <Box marginTop="8px" key={product.id}>
                  <Flex key={product.id} justifyContent="space-between" alignItems="center">
                    <Image boxSize="50px" borderRadius="full" objectFit="fill" src={product.imagen} alt={product.producto} />
                    <Text marginLeft={4} >{product.producto}</Text>
                    <Text color="gray.800">${product.precio}</Text>
                    <Button
                      width="20px"
                      marginLeft={4}
                      borderRadius="full"
                      colorScheme="red"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Icon boxSize={5} as={MdDeleteForever} />
                    </Button>
                  </Flex>
                </Box>
              ))}
              <Flex justifyContent="center" marginTop={4}>
                {cart.length > 0 ? (
                  <Button colorScheme="red" size="sm" width="80%" onClick={() => setCart([])}>
                    Limpiar pedido
                  </Button>
                ) : (
                  <Text color="gray.500">Pedido vacío</Text>
                )}
              </Flex>
              <Box marginTop="8px">
                {Boolean(cart.length) && (
                  <Flex justifyContent="center" alignItems="center">
                    <Button
                      width="80%"
                      size="sm"
                      colorScheme="green"
                      as={Link}
                      isExternal
                      href={`https://wa.me/3483521462?text=${encodeURIComponent(text)}`}
                    >
                      Completar pedido
                    </Button>
                  </Flex>
                )}
                {/*Boolean(cart.length) && (
                <Flex justifyContent="center" alignItems="center">
                  <Button 
                  size="sm"
                  width="268px" 
                  colorScheme="red" 
                  onClick={() => setCart([])}>
                    Eliminar pedido
                  </Button>
                </Flex>
              )*/}
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default Home;
