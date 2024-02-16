import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CarritoContext";

export const Navbar2 = () => {
  const [cart, setCart] = useContext(CartContext);

  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const navStyles = {
    color: "#000000",
    listStyle: "none",
    textDecoration: "none",
  };

  return (
    <nav>
      <Link to={"/"} style={navStyles}>
        <h2>Store</h2>
      </Link>
      <ul className="nav-list">
        <Link to={"/Carrito"} style={navStyles}>
          <li>
            Cart items: <span className="cart-count">{quantity}</span>
          </li>
        </Link>
      </ul>
    </nav>
  );
};