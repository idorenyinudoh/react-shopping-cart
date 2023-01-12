import formatPrice from 'utils/formatPrice';
import CartProducts from './CartProducts';

import { useCart } from 'contexts/cart-context';

import { useState } from "react";
import { useCheckout } from 'thepeer-react';

import * as S from './style';

const Cart = () => {
  const { products, total, isOpen, openCart, closeCart } = useCart();

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const config = {
    publicKey: process.env.REACT_APP_THEPEER_PUBLIC_KEY,
    amount: String(total.totalPrice * 100),
    email: email,
    currency: 'USD',
  }

  type EventResponse = {
    type: string
    data: undefined | Object
  }

  // @ts-ignore
  const handleCheckoutPayment = useCheckout({
    ...config,
    onSuccess: (response: EventResponse) => {
      console.log('🚀 onSuccess', response)
    },
    onError: (response: EventResponse) => {
      console.log('🚀 onError', response)
    },
    onClose: (response: EventResponse) => {
      console.log('🚀 onClose', response)
    }
  })

  const handleCheckout = () => {
    if (total.productQuantity) {
      handleCheckoutPayment();
    } else {
      alert('Add some product in the cart!');
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  return (
    <S.Container isOpen={isOpen}>
      <S.CartButton onClick={handleToggleCart(isOpen)}>
        {isOpen ? (
          <span>X</span>
        ) : (
          <S.CartIcon>
            <S.CartQuantity title="Products in cart quantity">
              {total.productQuantity}
            </S.CartQuantity>
          </S.CartIcon>
        )}
      </S.CartButton>

      {isOpen && (
        <S.CartContent>
          <S.CartContentHeader>
            <S.CartIcon large>
              <S.CartQuantity>{total.productQuantity}</S.CartQuantity>
            </S.CartIcon>
            <S.HeaderTitle>Cart</S.HeaderTitle>
          </S.CartContentHeader>

          <CartProducts products={products} />

          <S.CartFooter>
            <S.Sub>SUBTOTAL</S.Sub>
            <S.SubPrice>
              <S.SubPriceValue>{`${total.currencyFormat} ${formatPrice(
                total.totalPrice,
                total.currencyId
              )}`}</S.SubPriceValue>
              <S.SubPriceInstallment>
                {total.installments ? (
                  <span>
                    {`OR UP TO ${total.installments} x ${
                      total.currencyFormat
                    } ${formatPrice(
                      total.totalPrice / total.installments,
                      total.currencyId
                    )}`}
                  </span>
                ) : null}
              </S.SubPriceInstallment>
            </S.SubPrice>
            <S.CartInput type="name" placeholder="Abdulazeez Abdulazeez" value={name} onChange={(e) => setName(e.target.value)}/>
            <S.CartInput type="email" placeholder="abdulazeez@shop.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <S.CheckoutButton onClick={handleCheckout} autoFocus>
              Checkout
            </S.CheckoutButton>
          </S.CartFooter>
        </S.CartContent>
      )}
    </S.Container>
  );
};

export default Cart;
