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
  Select,
  Input,
} from '@chakra-ui/react';
import { PiNotePencilBold } from 'react-icons/pi';
import { SiWhatsapp } from 'react-icons/si';
import { FiShoppingCart } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import 'animate.css/animate.min.css';
import Swal from 'sweetalert2';
import api from 'comidasya/product/api';
import { Product } from 'comidasya/product/types';
import { GetStaticProps } from 'next';
import React, { useRef } from 'react';

interface Props {
  products: Product[];
}

interface CartItem {
  product: Product;
  cantidad: number;
  option: 'Normal' | 'Doble' | 'Triple';
  deliveryOption: 'delivery' | 'pickup';
  deliveryAddress?: string;
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Use un objeto para mantener el estado individual de cada producto
  const [selectedOptions, setSelectedOptions] = React.useState<{ [key: string]: 'Normal' | 'Doble' | 'Triple' }>({});
  const [deliveryOption, setDeliveryOption] = React.useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = React.useState<string>('');

  // Total del carrito
  const total = React.useMemo(() => {
    return cart.reduce(
      (total, { product, cantidad, option }) =>
        total + (product.precio + (option === 'Doble' ? 150 : option === 'Triple' ? 200 : 0)) * cantidad,
      0
    );
  }, [cart]);

  // Agregar al carrito
  const addToCart = (product: Product, option: 'Normal' | 'Doble' | 'Triple') => {
    const existingProduct = cart.find(
      (item) => item.product.id === product.id && item.option === option && item.deliveryOption === deliveryOption
    );

    if (existingProduct) {
      // Si el producto ya está en el carrito con la misma opción, aumenta la cantidad
      setCart((cart) =>
        cart.map((item) =>
          item.product.id === product.id && item.option === option
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      // Si el producto no está en el carrito con la misma opción, agrégalo con cantidad 1
      setCart((cart) => [...cart, { product, cantidad: 1, option, deliveryOption, deliveryAddress }]);
    }
  };

  // Eliminar individualmente
  const removeFromCart = (productId: string) => {
    setCart((cart) => cart.filter((item) => item.product.id !== productId));
  };

  // Mensaje de Whastapp final
  const text = React.useMemo(() => {
    const deliveryInfo = cart.length > 0 ? `Entrega: ${deliveryOption === 'delivery' ? 'A domicilio - ' + deliveryAddress : 'Recoger en persona'}` : '';
    const productsInfo = cart.reduce(
      (message, { product, cantidad, option }) =>
        message.concat(`- ${product.producto} Burguer: $${product.precio} x ${cantidad} (${option})\n`),
      ''
    );
    return `*Pedido:*\n${productsInfo}\nTotal: $${total}\n${deliveryInfo}`;
  }, [cart, total, deliveryOption, deliveryAddress]);

  return (
    // @ts-ignore
    <Stack spacing={6} marginRight="-15px" marginLeft="-15px">
      <Grid gridGap={2} templateColumns="repeat(auto-fit, minmax(150px, 1fr))">
        {products.map((product) => (
          <Stack
            display="flex"
            borderRadius="md"
            marginBottom="1px"
            padding={2}
            backgroundColor="yellow.200"
            key={product.id}
          >
            <Image
              height="130px"
              borderRadius={5}
              objectFit="cover"
              src={product.imagen}
              alt=""
              css={{
                '@media (max-width: 347px)': {
                  height: '220px',
                },
              }}
            />
            <Text fontSize="20px" fontWeight="700">
              {product.producto}
            </Text>
            <Text
              fontSize="15px"
              fontWeight="400"
              height="110px"
              css={{
                '@media (max-width: 347px)': {
                  height: 'auto',
                },
              }}
            >
              {product.descripcion}
            </Text>
            <Text fontSize="17px" fontWeight="500">
              $ {product.precio}
            </Text>
            <Select
              backgroundColor="white"
              value={selectedOptions[product.id] || 'Normal'}
              onChange={(e) => setSelectedOptions({ ...selectedOptions, [product.id]: e.target.value as 'Normal' | 'Doble' | 'Triple' })}
            >
              <option value="Normal">Normal</option>
              <option value="Doble">Doble ($150)</option>
              <option value="Triple">Triple ($200)</option>
            </Select>
            <Button
              colorScheme="primary"
              onClick={() => {
                addToCart(product, selectedOptions[product.id] || 'Normal');
                Swal.fire({
                  title: 'Producto agregado',
                  text: 'Puedes verlo en el carrito verde',
                  icon: 'success',
                  confirmButtonColor: '#D69E2E',
                  timer: 2500,
                  toast: true,
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

      <Drawer isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size="20px" marginTop="5px" />
          <DrawerBody justifyContent="center" backgroundColor="yellow.500">
            <Box marginTop="50px" marginLeft="-13px" marginRight="-13" display="flex" flexDirection="column" borderRadius="md" padding={4} backgroundColor="gray.100">
              <Text color="black" display="flex" alignItems="center" gap="5px" fontSize="22px" fontWeight="bold" marginBottom={2}>
                Pedido <PiNotePencilBold size="25px" />
              </Text>
              {cart.map(({ product, cantidad, option }) => (
                <Box display="flex" alignItems="center" marginTop="8px" key={product.id} >
                  <Flex
                    key={product.id}
                    width="100%"
                    justifyContent="space-evenly"
                    alignItems="center"
                    backgroundColor="gray.300"
                    borderRadius="5px"
                    padding="10px"
                    border="0.5px solid gray"
                  >
                    <Image
                      marginLeft={-2}
                      marginTop={1.5}
                      marginBottom={1.5}
                      boxSize="48px"
                      borderRadius="full"
                      objectFit="fill"
                      src={product.imagen}
                      alt={product.producto}
                    />
                    <Box display="flex" flexDirection="column" width="40%">
                      <Text fontSize="17px" fontWeight="bold">
                        {product.producto}
                      </Text>
                      <Text fontSize="16px" fontWeight="medium" color="green" mt="-1">
                        {option}
                      </Text>
                      <Text fontWeight="500" fontSize="16px">
                        ${product.precio}
                      </Text>
                    </Box>
                    <Text fontWeight="bold" fontSize="17px">
                      x{cantidad}
                    </Text>
                    <Button
                      width="20px"
                      marginRight={-2}
                      borderRadius="full"
                      colorScheme="red"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Icon boxSize={5} as={MdDeleteForever} />
                    </Button>
                  </Flex>
                </Box>

              ))}
              <Flex justifyContent="center" alignItems="center">
                {Boolean(cart.length) && (
                  <Text display="flex" gap="5px" fontWeight="bold" fontSize="20px" mt="10px">
                    Total:
                    <Text fontWeight="normal">${total}</Text>
                  </Text>
                )}
              </Flex>
              {Boolean(cart.length) && (
                <Box
                  display="flex"
                  flexDirection="column"
                  marginTop="8px"
                  justifyContent="center"
                  alignItems="center"
                  alignContent="center"
                  gap="3px"
                >
                  {/* @ts-ignore */}
                  <Select
                    backgroundColor="gray.200"
                    border="0.5px solid gray"
                    textAlign="start"
                    fontSize="17px"
                    width="100%"
                    value={deliveryOption}
                    onChange={(e) => setDeliveryOption(e.target.value as 'delivery' | 'pickup')}
                  >
                    <option value="pickup">Buscar en persona</option>
                    <option value="delivery">Entrega a domicilio</option>
                  </Select>
                  {deliveryOption === 'delivery' && (
                    <Input

                      border="0.5px solid gray"
                      width="100%"
                      backgroundColor="white"
                      type="text"
                      placeholder="Dirección de entrega..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  )}
                </Box>
              )}
              <Box marginTop="15px">
                {Boolean(cart.length) && (
                  <Flex justifyContent="center" alignItems="center">
                    {/* @ts-ignore */}
                    <Button
                      fontSize="17px"
                      width="100%"
                      size="md"
                      colorScheme="green"
                      as={Link}
                      isExternal
                      href={`https://wa.me/3483521462?text=${encodeURIComponent(text)}`}
                    >
                      Completar pedido <Box ml="7px"><SiWhatsapp size="20px" /></Box>
                    </Button>
                  </Flex>
                )}
              </Box>
              <Flex justifyContent="center" marginTop={2}>
                {cart.length > 0 ? (
                  <Button fontSize="17px" colorScheme="red" size="md" width="100%" onClick={() => setCart([])}>
                    Eliminar pedido
                  </Button>
                ) : (
                  <Text color="gray.500" fontSize="18px">
                    Pedido vacío
                  </Text>
                )}
              </Flex>


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
