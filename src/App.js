import { useState } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import arrowDown from "./down-arrow.svg";
import arrowUp from "./up-arrow.svg";
import logo from "./logo.svg";

const Get_Categories = gql`
  query GetProducts {
    categories {
      name
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery(Get_Categories);
  const [currency, setCurrency] = useState("USD");
  const [currencySign, setCurrencySign] = useState("$");
  const [isCurrActive, setIsCurrActive] = useState(false);

  function showCurrencyDropdown() {
    setIsCurrActive(!isCurrActive);
  }

  function changeCurrency(curr, currSign) {
    setCurrency(curr);
    setCurrencySign(currSign);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <>
      <Header
        categories={data.categories}
        changeCurrency={changeCurrency}
        currencySign={currencySign}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
      />
      <Routes>
        <Route
          path="/*"
          element={
            <CategoryPage category={data.categories[0]} currency={currency} />
          }
        />
        {data.categories.map((category) => {
          return (
            <Route
              path={"/" + category.name}
              key={category.name}
              element={<CategoryPage category={category} currency={currency} />}
            />
          );
        })}
      </Routes>
    </>
  );
}

function Header({
  categories,
  currencySign,
  changeCurrency,
  showCurrencyDropdown,
  isCurrActive,
}) {
  return (
    <div className="Header">
      {categories.map((category) => {
        return (
          <NavLink
            className={({ isActive }) =>
              isActive ? "headerLink activeLink" : "headerLink"
            }
            to={category.name}
            key={category.name}
          >
            {category.name.toUpperCase()}
          </NavLink>
        );
      })}
      <img className="logo" src={logo} alt="logo" />
      <div className="currencySetting">
        <button
          className="currencyChoiserButton"
          onClick={() => showCurrencyDropdown()}
        >
          {currencySign + " "}
          <img
            src={isCurrActive ? arrowUp : arrowDown}
            width="10px"
            height="10px"
          />
        </button>
        {isCurrActive ? (
          <div className="currencyList">
            <p
              onClick={() => {
                changeCurrency("USD", "$");
                showCurrencyDropdown();
              }}
            >
              $ USD
            </p>
            <p
              onClick={() => {
                changeCurrency("GBP", "£");
                showCurrencyDropdown();
              }}
            >
              £ GBP
            </p>
            <p
              onClick={() => {
                changeCurrency("AUD", "A$");
                showCurrencyDropdown();
              }}
            >
              A$ AUD
            </p>
            <p
              onClick={() => {
                changeCurrency("JPY", "¥");
                showCurrencyDropdown();
              }}
            >
              ¥ JPY
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CategoryPage({ category, currency }) {
  return (
    <div className="categoryPage">
      <h1> Category: {category.name}</h1>
      <div className="productList">
        {category.products.map((product) => {
          return (
            <div className="product" key={product.id}>
              <img className="productImg" src={product.gallery[0]} />
              <div className="productInfo">
                <p>{product.name}</p>
                {product.prices.map((price) => {
                  if (price.currency.label === currency) {
                    return (
                      <p key={price.currency.label}>
                        <b>{price.currency.symbol + price.amount}</b>
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
