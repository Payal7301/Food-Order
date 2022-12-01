import { useContext } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const val={value:parseInt(cartCtx.totalAmount.toFixed(0))};
   async function displayRazorpay() {
    const data = await fetch("http://localhost:1337/razorpay", {
      method: "POST",
      body: JSON.stringify(val)
    }).then((t) => t.json());
  
    console.log("data  "+data);
  
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      currency: data.currency,
      amount: data.amount,
      name: "ReactMeals",
      description: "Order Meals Online",
      image: "http://localhost:1337/logo.png",
      order_id: data.id,
      handler: function (response) {
        alert("PAYMENT ID ::" + response.razorpay_payment_id);
        alert("ORDER ID :: " + response.razorpay_order_id);
      },
      prefill: {
        name: "Payal",
        email: "payal.aggarwal@thoughtworks.com",
        contact: "9999999999",
      },
    };
  
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  

  const totalAmount = `₹${cartCtx.totalAmount.toFixed(0)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        {/* <span>{totalAmount}</span> */}
        <span>{`₹100`}</span>
      </div>
      <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>
          Close
        </button>
        {hasItems && <button className={classes.button} onClick={displayRazorpay}>Order</button>}
      </div>
    </Modal>
  );
};

export default Cart;
