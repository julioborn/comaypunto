// Cart.tsx

import React from 'react';
import { Stack, Text, Button } from '@chakra-ui/react';
import { Product } from 'comidasya/product/types';

interface CartProps {
    cart: Product[];
    clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, clearCart }) => {
    const total = cart.reduce((total, product) => total + product.precio, 0);

    return (
        <Stack spacing={2}>
            <Text fontWeight="700">Carrito de compras</Text>
            {cart.map((product) => (
                <Stack key={product.id} direction="row" justifyContent="space-between">
                    <Text>{product.producto}</Text>
                    <Text>${product.precio}</Text>
                </Stack>
            ))}
            <Text fontWeight="700">Total: ${total}</Text>
            <Button colorScheme="red" onClick={clearCart}>
                Eliminar carrito
            </Button>
        </Stack>
    );
};

export default Cart;
