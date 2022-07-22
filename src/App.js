import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { Routes, Route, Link } from "react-router-dom";

const Get_Products = gql`
  query GetProducts {
    categories {
      name
      products {
        name
      }
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery(Get_Products);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <>
      <Header categories={data.categories} />
      <Routes>
        <Route path="/*" element={<p>pip</p>} />
        {data.categories.map((category) => {
          return (
            <Route
              path={"/" + category.name}
              key={category.name}
              element={<p>{category.name}</p>}
            />
          );
        })}
      </Routes>
    </>
  );
}

function Header({ categories }) {
  return (
    <div className="Header">
      {categories.map((category) => {
        return (
          <Link to={category.name}>
            <button className="">{category.name}</button>
          </Link>
        );
      })}
    </div>
  );
}
