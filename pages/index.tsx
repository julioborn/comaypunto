import { Button, Icon, Grid, Stack, Text, Link, Flex, Image, Box } from '@chakra-ui/react';
import api from 'comidasya/product/api';
import { Product } from 'comidasya/product/types';
import { GetStaticProps } from 'next';
import React, { useRef } from 'react';
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { PiNotePencilBold } from "react-icons/pi";
import { FiShoppingCart } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2'

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);

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
    <Stack>
      <Grid gridGap={6} templateColumns="repeat(auto-fit, minmax(150px, 1fr))">
        {products.map((product) => (
          <Stack display="flex" borderRadius="md" padding={4} backgroundColor="yellow.200" key={product.id}>
            <Image maxHeight={300} borderRadius={5} objectFit="cover" src={product.imagen} alt="" />
            <Text fontWeight="700">{product.producto}</Text>
            <Text fontWeight="400">{product.descripcion}</Text>
            <Text fontWeight="500">$ {product.precio}</Text>
            {/* @ts-ignore */}
            <Button
              colorScheme="primary"
              onClick={() => {addToCart(product);
                Swal.fire({
                  title: "Producto agregado",
                  text: "Puedes verlo en el carrito",
                  icon: "success",
                  timer: 2000
                })
              }}>
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>

      {Boolean(cart.length) && (
        <Flex position="fixed" top={4} right={6} justifyContent="center" alignItems="center">
          <Button width="90px" height="90px" borderRadius="full" colorScheme="green" onClick={onOpen}>
            <Box display="flex" gap="5px">
              <FiShoppingCart size="30px" />
              <Text fontSize="25px"> {cart.length} </Text>
            </Box>
          </Button>
        </Flex>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody backgroundColor="yellow.500">
            <Box marginTop="35px" display="flex" flexDirection="column" borderRadius="md" padding={4} backgroundColor="gray.100">
              <Text color="black" display="flex" alignItems="center" gap="5px" fontSize="lg" fontWeight="bold" marginBottom={2}>
                Pedido <PiNotePencilBold size="22px" />
              </Text>
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
              {/* @ts-ignore */}
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
                    {/* @ts-ignore */}
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
