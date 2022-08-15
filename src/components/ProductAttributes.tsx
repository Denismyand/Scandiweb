import React from "react";
import { useDispatch } from "react-redux";
import { selectAttribute } from "../utils/reducers/cartSlice";
import { AttributesInfo, CartContent } from "../utils/types";

type Input = {
  product: CartContent;
  styles: {
    attributeName: string;
    activeTextAttributeSelectButton: string;
    textAttributeSelectButton: string;
    activeSwatchAttributeSelectButton: string;
    swatchAttributeSelectButton: string;
  };
};

export function ProductAttributes({ product, styles }: Input) {
  const dispatch = useDispatch();

  function handleSelectAttribute(
    product: CartContent,
    attribute: AttributesInfo,
    id: string
  ) {
    dispatch(selectAttribute({ product, attribute, id }));
  }

  function differAttributes(attribute: AttributesInfo) {
    return (
      <>
        <p className={styles.attributeName}>{attribute.name.toUpperCase()}:</p>
        {attribute.type === "text" &&
          attribute.items.map((item) => {
            return (
              <button
                className={
                  item.selectedItem
                    ? styles.activeTextAttributeSelectButton
                    : styles.textAttributeSelectButton
                }
                key={item.id}
                onClick={() =>
                  handleSelectAttribute(product, attribute, item.id)
                }
              >
                {item.value}
              </button>
            );
          })}
        {attribute.type === "swatch" &&
          attribute.items.map((item) => {
            return (
              <button
                className={
                  item.selectedItem
                    ? styles.activeSwatchAttributeSelectButton
                    : styles.swatchAttributeSelectButton
                }
                key={item.id}
                style={{
                  backgroundColor: `${item.value}`,
                }}
                onClick={() =>
                  handleSelectAttribute(product, attribute, item.id)
                }
              />
            );
          })}
      </>
    );
  }
  return (
    <>
      {product.attributes.map((attribute) => {
        return <div key={attribute.id}>{differAttributes(attribute)}</div>;
      })}
    </>
  );
}
