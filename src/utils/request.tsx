import { gql, useQuery } from "@apollo/client";

export const getCategories = gql`
  query GetProducts {
    categories {
      name
    }
  }
`;

export const useCategories = () => {
  const { loading, error, data } = useQuery(getCategories);
  return { loading, error, data };
};

const getCategory = gql`
  query Category($categoryName: String!) {
    category(input: { title: $categoryName }) {
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

export const useCategory = (categoryName?: string) => {
  const { loading, error, data } = useQuery(getCategory, {
    variables: { categoryName },
  });
  return { loading, error, data };
};

const getProduct = gql`
  query Product($productId: String!) {
    product(id: $productId) {
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
`;

export const useProduct = (productId?: string) => {
  const { loading, error, data } = useQuery(getProduct, {
    variables: { productId },
  });
  return { loading, error, data };
};
