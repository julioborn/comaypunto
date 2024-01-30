import {
  Button,
  Icon,
  Grid,
  Stack,
  Text,
  Link,
  Flex,
  Image,
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { PiNotePencilBold } from 'react-icons/pi';
import { FiShoppingCart } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import 'animate.css/animate.min.css';
import Swal from 'sweetalert2';
import api from 'comidasya/product/api';
import { Product } from 'comidasya/product/types';
import { GetStaticProps } from 'next';
import React, { useRef } from 'react';

interface CartItem {
  product: Product;
  cantidad: number;
}

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const addToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.product.id === product.id);

    if (existingProduct) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      setCart((cart) =>
        cart.map((item) =>
          item.product.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      // Si el producto no está en el carrito, agrégalo con cantidad 1
      setCart((cart) => [...cart, { product, cantidad: 1 }]);
    }
  };

  const total = React.useMemo(() => {
    return cart.reduce((total, { product, cantidad }) => total + product.precio * cantidad, 0);
  }, [cart]);

  const removeFromCart = (productId: string) => {
    setCart((cart) => cart.filter((item) => item.product.id !== productId));
  };

  const text = React.useMemo(
    () =>
      cart
        .reduce(
          (message, { product, cantidad }) =>
            message.concat(`* ${product.producto}: $${product.precio} x ${cantidad}\n`),
          ''
        )
        .concat(`- Total: $${cart.reduce((total, { product, cantidad }) => total + product.precio * cantidad, 0)}`),
    [cart]
  );

  return (
    // @ts-ignore
    <Stack spacing={6}>
      <Grid gridGap={2} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
        {products.map((product) => (
          <Stack display="flex" borderRadius="md" marginBottom="10px" padding={4} backgroundColor="yellow.200" key={product.id}>
            <Image maxHeight={300} borderRadius={5} objectFit="cover" src={product.imagen} alt="" />
            <Text fontSize="20px" fontWeight="700">{product.producto}</Text>
            <Text fontSize="17px" fontWeight="400">{product.descripcion}</Text>
            <Text fontSize="17px" fontWeight="500">$ {product.precio}</Text>
            <Button
              colorScheme="primary"
              onClick={() => {
                addToCart(product);
                Swal.fire({
                  title: 'Producto agregado',
                  text: 'Puedes verlo en el carrito verde',
                  icon: 'success',
                  confirmButtonColor: '#D69E2E',
                  timer: 3500,
                  showClass: {
                    popup: 'animate__animated animate__fadeInTopRight',
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOutTopRight',
                  },
                });
              }}
            >
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>

      {Boolean(cart.length) && (
        <Flex position="fixed" top={4} right={6} justifyContent="center" alignItems="center">
          <Button width="90px" height="90px" borderRadius="full" colorScheme="green" onClick={onOpen}>
            <Box display="flex">
              <FiShoppingCart size="30px" />
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
              {/* @ts-ignore */}
              <Text color="black" display="flex" alignItems="center" gap="5px" fontSize="22px" fontWeight="bold" marginBottom={2}>
                Pedido <PiNotePencilBold size="25px" />
              </Text>
              {cart.map(({ product, cantidad }) => (
                <Box marginTop="8px" key={product.id}>
                  <Flex
                    key={product.id}
                    justifyContent="space-between"
                    alignItems="center"
                    backgroundColor="gray.300"
                    borderRadius="5px"
                  >
                    <Image
                      marginLeft={3}
                      marginTop={1.5}
                      marginBottom={1.5}
                      boxSize="60px"
                      borderRadius="full"
                      objectFit="fill"
                      src={product.imagen}
                      alt={product.producto}
                    />
                    <Box display="flex" flexDirection="column">
                      <Text fontSize="17px" fontWeight="bold">
                        {product.producto}
                      </Text>
                      <Text color="gray.800" fontSize="17px">
                        ${product.precio}
                      </Text>
                    </Box>
                    <Text fontWeight="bold" fontSize="20px">
                      x{cantidad}
                    </Text>
                    <Button
                      width="20px"
                      marginRight={3}
                      borderRadius="full"
                      colorScheme="red"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Icon boxSize={5} as={MdDeleteForever} />
                    </Button>
                  </Flex>
                </Box>
              ))}
              <Flex justifyContent="center" alignItems="center" marginTop={3}>
                {Boolean(cart.length) && (
                  <Text display="flex" gap="5px" fontWeight="bold" fontSize="20px">
                    Total:
                    <Text fontWeight="normal">${total}</Text>
                  </Text>
                )}
              </Flex>
              <Flex justifyContent="center" marginTop={4}>
                {cart.length > 0 ? (
                  <Button fontSize="17px" colorScheme="red" size="md" width="80%" onClick={() => setCart([])}>
                    Eliminar pedido
                  </Button>
                ) : (
                  <Text color="gray.500" fontSize="20px">
                    Pedido vacío
                  </Text>
                )}
              </Flex>
              <Box marginTop="8.1px">
                {Boolean(cart.length) && (
                  // eslint-disable-next-line import/no-unresolved
                  <Flex justifyContent="center" alignItems="center">
                    {/* @ts-ignore */}
                    <Button
                      fontSize="17px"
                      width="80%"
                      size="md"
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
